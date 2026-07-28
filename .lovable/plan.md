## What this app is

**Catering by Sizzle** — a B2B corporate catering ordering platform for the Swedish market (prices in SEK, Swedish VAT rules). Companies register, their employees browse curated catering menus, customize them, order for delivery to a company address, and get invoiced. An internal admin dashboard manages the catalog and the order pipeline.

Stack: React 18 + Vite + TypeScript + Tailwind + shadcn/ui, TanStack Query for server state, React Router. Backend is Supabase (Postgres + Auth + RLS + Edge Functions), with Resend for transactional email.

---

## Feature inventory

**Public / marketing**
- Landing page (`/`) with Hero, Features, MenuShowcase, FoodPartners (chefs), Testimonials, CTA
- Contact page, About page, Footer/Navbar layout shell
- Logged-in users hitting `/` are auto-redirected to `/order`

**Authentication**
- Register (zod-validated: name, email, phone, password, terms), Login (with show/hide password, remember me), Forgot password, Reset password
- Session handled in `AuthContext` (listener first, then `getSession`)
- A DB trigger function `handle_new_user()` copies name/email/phone from auth metadata into `profiles`

**Company onboarding** (`/company-registration`)
- Tab 1 – Create company: name, address, organization number → inserts into `companies`, then sets the user's `profiles.company_id` and `is_company_admin = true`
- Tab 2 – Join existing company: searchable company list (`CompanySearch`) + 5 most recent → sets `company_id`, `is_company_admin = false`

**Ordering flow** (`/order`)
- Company info box, delivery date (defaults to +48h) and time picker
- Address selector across `company_addresses` (default address preselected, falls back to the company address) plus inline "add new address"
- Vegan-only toggle
- Two-step wizard: pick **event type** → pick **serving style** → filtered menu grid
- Dev helper: "seed sample menu items" button

**Menu customization** (`/menu/:id`)
- Loads a menu item with all its event types, serving styles and sub-products
- Sub-products grouped by category, defaults pre-checked; toggling adds/subtracts the sub-product price from the base price
- Quantity selector enforcing the item's `minimum_quantity` (default 5)
- Live price summary → add to cart

**Cart** (`/cart`)
- Server-persisted cart in `cart_items` (per user), managed through `CartContext` + TanStack Query mutations (add / update quantity / remove / clear)
- Prices formatted as SEK via `Intl.NumberFormat('sv-SE')`

**Checkout** (`/checkout`)
- Customer info, delivery info, invoice details, order items list
- Allergy notes + delivery notes
- Discount code input validated against `discount_codes` (active, within valid_from/valid_until)
- Cost breakdown from `TaxUtils`: 12% VAT on food, 25% VAT on services, 5% admin fee, fixed 450 SEK delivery fee; company discount (`companies.discount_percentage`) and code discount apply to admin/delivery fees, whichever is higher
- Blocks placing an order if no delivery address or incomplete company invoice details

**Order confirmation & history**
- `/order-success/:orderId` — confirmation card with order id, date, status, total, email status
- `/order-history` — the user's past orders

**Admin dashboard** (`/admin`, gated by the `is_admin()` RPC)
- Products (sub-products), Menu Items, Event Types, Serving Styles
- Relationships manager: menu↔event type, menu↔serving style, menu↔sub-product (with default flags)
- Orders manager: list, view details, change status, resend customer/kitchen email, generate + download invoice PDF

**Edge Functions**
- `send-order-emails` — verifies JWT, checks `user_owns_order` or `is_admin`, loads the order + items, renders an `email_templates` row (`order_confirmation` or `kitchen_notification`), sends via Resend, flips `customer_email_sent` / `kitchen_email_sent`
- `generate-invoice` — same auth checks, loads order + items + company, mints a reference (`INV-YYYY-xxxxxxxx`), builds a PDF, sets `invoice_generated`

---

## Data model and relationships

```text
auth.users ──1:1──> profiles ──N:1──> companies ──1:N──> company_addresses
                       │                   └──1:N──> company_invites (table exists, unused in UI)
                       └──1:N──> cart_items, orders
user_roles (user_id, role: admin | company_admin | user)

menu_items ─┬─ menu_item_event_types ──> event_types
            ├─ menu_item_serving_styles ──> serving_styles
            └─ menu_item_sub_products (is_default) ──> sub_products

orders ──1:N──> order_items ──> menu_items
orders: totals, VAT split, fees, discounts, email/invoice flags
discount_codes (percentage, validity window, discount_applies_to[])
email_templates (name, subject, body with {placeholders})
chefs (marketing content on the landing page)
```

Key points:
- `profiles.company_id` is the hinge of the whole B2B model — it drives addresses, company discount, and invoice details.
- Menu ↔ event type / serving style / sub-product are all **many-to-many join tables**; the order wizard filters on them with inner joins.
- `cart_items.selected_sub_products` and `order_items.selected_sub_products` are JSONB arrays of sub-product ids, with `total_price` snapshotted per line.
- Security is enforced with security-definer functions: `has_role`, `is_admin`, `is_user_company_admin`, `get_user_company_id`, `user_owns_order`, `users_in_same_company`, `user_has_no_company` — used both in RLS policies and by edge functions.

---

## User flows

**New user**
1. Lands on `/` → Register → account created, profile row auto-created by trigger
2. Redirected to `/company-registration` → creates a company (becomes company admin) or joins an existing one
3. Lands on `/order` → picks delivery date/time and address → event type → serving style → menu
4. Opens a menu → customizes sub-products and quantity → adds to cart
5. Cart → Checkout → optional discount code, notes → Place Order
6. Order + order_items written, cart cleared, customer + kitchen emails fired → `/order-success/:id`

**Returning user**
1. Login (or existing session) → auto-redirected from `/` to `/order`
2. Server-persisted cart is restored automatically
3. Reorder through the same wizard; company address, discount and invoice details are pre-filled
4. Manage profile (`/profile`), company details (`/company-settings`), review past orders (`/order-history`)

**Admin**
1. Login → `/admin` (blocked unless `is_admin()` returns true)
2. Maintain catalog and relationships
3. Work the order queue: view, update status, resend emails, generate invoice PDFs

---

## Notable gaps worth knowing about

- `company_invites` and `user_roles` exist in the database but have no UI; role assignment is manual.
- `CompanySettings` and `Profile` are editable by any company member, not just company admins.
- Emails/invoices are called via `${window.location.origin}/api/...` rather than `supabase.functions.invoke`, which only works if that path is proxied to the edge functions.
- Delivery date/time chosen in `/order` is not persisted on the order record.
- Discount codes only reduce admin and delivery fees — never the product subtotal, despite `discount_applies_to` supporting `products`.

Approve this and I can save it as a `PROJECT_OVERVIEW.md` in the repo, and/or start fixing any of the gaps above.
