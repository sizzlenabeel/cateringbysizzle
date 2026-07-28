# Catering by Sizzle — Project Overview

A B2B corporate catering ordering platform for the Swedish market (prices in SEK, Swedish VAT rules).
Companies register, their employees browse curated catering menus, customize them, order for delivery
to a company address, and get invoiced. An internal admin dashboard manages the catalog and the order
pipeline.

**Stack:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui, TanStack Query for server state,
React Router. Backend is Supabase (Postgres + Auth + RLS + Edge Functions), with Resend for
transactional email.

---

## 1. Feature inventory

### Public / marketing
- Landing page (`/`) with Hero, Features, MenuShowcase, FoodPartners (chefs), Testimonials, CTA
- Contact page, About page, shared Navbar/Footer layout shell
- Logged-in users hitting `/` are auto-redirected to `/order`

### Authentication
- Register (zod-validated: first/last name, email, phone, password + confirm, terms checkbox)
- Login (show/hide password, remember me), Forgot password, Reset password
- Session handled in `AuthContext` — auth state listener registered first, then `getSession()`
- DB trigger function `handle_new_user()` copies name/email/phone from auth metadata into `profiles`

### Company onboarding (`/company-registration`)
- **Create company:** name, address, organization number → inserts into `companies`, then sets the
  user's `profiles.company_id` and `is_company_admin = true`
- **Join existing company:** searchable company list (`CompanySearch`) plus the 5 most recently added
  → sets `company_id`, `is_company_admin = false`

### Ordering flow (`/order`)
- Company info box, delivery date (defaults to +48 hours) and time picker
- Address selector across `company_addresses` (default address preselected, falls back to the company
  address), plus inline "add new address"
- Vegan-only toggle
- Two-step wizard: pick **event type** → pick **serving style** → filtered menu grid
- Dev helper: "seed sample menu items" button

### Menu customization (`/menu/:id`)
- Loads a menu item with all its event types, serving styles and sub-products
- Sub-products grouped by category, defaults pre-checked; toggling adds/subtracts the sub-product
  price from the base price
- Quantity selector enforcing the item's `minimum_quantity` (default 5)
- Live price summary → add to cart

### Cart (`/cart`)
- Server-persisted cart in `cart_items` (per user), managed through `CartContext` + TanStack Query
  mutations (add / update quantity / remove / clear)
- Prices formatted as SEK via `Intl.NumberFormat('sv-SE')`

### Checkout (`/checkout`)
- Customer info, delivery info, invoice details, order items list
- Allergy notes and delivery notes
- Discount code input validated against `discount_codes` (active, within `valid_from`/`valid_until`)
- Cost breakdown from `src/utils/TaxUtils.ts`:
  - 12% VAT on food products
  - 25% VAT on services (admin fee and delivery)
  - 5% administrative fee on the subtotal
  - Fixed 450 SEK delivery fee
  - Company discount (`companies.discount_percentage`) and code discount both apply to admin and
    delivery fees — the higher of the two wins
- Blocks placing an order if there is no delivery address or the company invoice details are incomplete

### Order confirmation and history
- `/order-success/:orderId` — confirmation card with order id, date, status, total, email status
- `/order-history` — the signed-in user's past orders

### Admin dashboard (`/admin`, gated by the `is_admin()` RPC)
- Products (sub-products), Menu Items, Event Types, Serving Styles
- Relationships manager: menu ↔ event type, menu ↔ serving style, menu ↔ sub-product (with default flags)
- Orders manager: list, view details, change status, resend customer/kitchen email, generate and
  download invoice PDF

### Edge Functions
- **`send-order-emails`** — verifies the JWT, checks `user_owns_order` or `is_admin`, loads the order
  and its items, renders an `email_templates` row (`order_confirmation` or `kitchen_notification`),
  sends via Resend, then flips `customer_email_sent` / `kitchen_email_sent`
- **`generate-invoice`** — same auth checks, loads order + items + company, mints a reference
  (`INV-YYYY-xxxxxxxx`) if missing, builds a PDF, sets `invoice_generated`

---

## 2. Data model and relationships

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

### Key points
- `profiles.company_id` is the hinge of the whole B2B model — it drives delivery addresses, the
  company discount, and the invoice details used at checkout.
- Menu ↔ event type / serving style / sub-product are all **many-to-many join tables**; the order
  wizard filters on them with inner joins in `src/services/menuService.ts`.
- `cart_items.selected_sub_products` and `order_items.selected_sub_products` are JSONB arrays of
  sub-product ids, with `total_price` snapshotted per line so historical orders stay accurate.
- Security is enforced with security-definer functions used both in RLS policies and by edge
  functions: `has_role`, `is_admin`, `is_user_company_admin`, `get_user_company_id`,
  `user_owns_order`, `users_in_same_company`, `user_has_no_company`.

---

## 3. User flows

### New user
1. Lands on `/` → Register → account created, profile row auto-created by the trigger
2. Redirected to `/company-registration` → creates a company (becomes company admin) or joins an
   existing one
3. Lands on `/order` → picks delivery date/time and address → event type → serving style → menu
4. Opens a menu → customizes sub-products and quantity → adds to cart
5. Cart → Checkout → optional discount code, allergy/delivery notes → Place Order
6. `orders` + `order_items` written, cart cleared, customer and kitchen emails fired →
   `/order-success/:id`

### Returning user
1. Login (or existing session) → auto-redirected from `/` to `/order`
2. Server-persisted cart is restored automatically
3. Reorders through the same wizard; company address, discount and invoice details are pre-filled
4. Manages profile (`/profile`), company details (`/company-settings`), reviews past orders
   (`/order-history`)

### Admin
1. Login → `/admin` (blocked unless the `is_admin()` RPC returns true)
2. Maintains the catalog: products, menu items, event types, serving styles, and their relationships
3. Works the order queue: view, update status, resend emails, generate invoice PDFs

---

## 4. Route map

| Route | Page | Access |
| --- | --- | --- |
| `/` | Landing (redirects to `/order` when signed in) | Public |
| `/login`, `/register` | Auth | Public |
| `/forgot-password`, `/reset-password` | Password recovery | Public |
| `/contact` | Contact | Public |
| `/company-registration` | Create/join company | Signed in |
| `/order` | Order wizard | Signed in |
| `/menu/:id` | Menu customization | Signed in |
| `/cart` | Cart | Signed in |
| `/checkout` | Checkout | Signed in |
| `/order-success/:orderId` | Confirmation | Order owner |
| `/order-history` | Past orders | Signed in |
| `/profile` | Personal profile | Signed in |
| `/company-settings` | Company details | Company member |
| `/admin` | Admin dashboard | `is_admin()` |

---

## 5. Known gaps

- `company_invites` and `user_roles` exist in the database but have no UI; role assignment is manual.
- `CompanySettings` and `Profile` are editable by any company member, not just company admins.
- Emails/invoices are called via `${window.location.origin}/api/...` rather than
  `supabase.functions.invoke`, which only works if that path is proxied to the edge functions.
- The delivery date/time chosen in `/order` is not persisted on the order record.
- Discount codes only reduce admin and delivery fees — never the product subtotal, despite
  `discount_applies_to` supporting `products`.
