## Goal

Let a brand-new user pick or create their company **during registration** (before any email is confirmed), then verify their email before they can order. Along the way, split company data into a public part and a private/billing part so opening up company search doesn't leak sensitive fields.

## Why the current flow breaks

- Email confirmation is on, so `signUp()` returns a user but **no session**. The app immediately routes to `/company-registration`, where every call runs as anonymous: `auth.uid()` is null, so reading `companies` and updating `profiles.company_id` both fail.
- Separately, all three SELECT policies on `companies` require `id IN (select company_id from profiles where id = auth.uid())`. So "Join existing company" can never list anything — even for a confirmed user without a company. That search is broken today regardless of verification.

Important consequence for your suggestion: removing RLS from `companies` alone is not enough. The **profile update** is the blocked step, and it's blocked because there's no session. So the company choice has to be applied server-side, not by the browser.

## Approach

Carry the company choice in the signup metadata and let the existing `handle_new_user()` trigger (which already runs with elevated privileges) do the linking. No session needed, no RLS holes opened.

```text
Register form (single page, 2 sections)
  1. Personal details + password
  2. Company: search existing  ─or─  create new

  ↓ signUp(email, password, { data: { first_name, ..., company_id }
                                   or { ..., new_company: {name, address, org_no} } })

  ↓ handle_new_user() trigger (security definer)
       creates profile
       links company_id  ─or─  inserts company + company_private, sets is_company_admin

  ↓ "Check your inbox" screen  (no session yet — ordering impossible)

  ↓ user clicks confirmation link → returns signed in → /order, fully set up
```

Because Supabase issues no session until the link is clicked, "can't order before verifying" is enforced by construction. We add a database-level backstop on top so it can't be bypassed later.

## Database changes (one migration)

**1. Split the company tables**
- New `public.company_private` (`company_id` PK → `companies.id` on delete cascade, `discount_percentage`, `billing_email`, timestamps). Copy existing values across, then drop those two columns from `companies`.
- `companies` keeps the public-facing fields only: `id`, `name`, `address`, `organization_number`, `logo_url`.
- Grants: `company_private` → `authenticated` (select/update) and `service_role`. Policies: only members of that company can read; only company admins can update.

**2. Make company search work without exposing the customer list**
- Drop the three duplicate membership-only SELECT policies on `companies`; add one clean policy letting **any signed-in user** read the public columns.
- Add a security-definer RPC `search_companies(q text)` returning `id, name, address` — requires at least 2 characters and caps results, and is callable by `anon` so it works on the registration page before a session exists. Anonymous visitors can look up a company by name but can't enumerate the whole table.
- Tighten the current `Anyone can create companies` INSERT policy (`with check true`, open to anon) — creation moves into the trigger, so the policy becomes company-admin/authenticated only.

**3. Verification backstop**
- `public.is_email_verified()` — security definer, reads `auth.users.email_confirmed_at` for `auth.uid()`.
- Add it to the INSERT policies on `orders` and `order_items` so an unverified account can never write an order, even via the API directly. Cart stays open so a half-verified user isn't stuck.

**4. Update `handle_new_user()`**
- Read `company_id` from signup metadata and link it; or read `new_company` and insert into `companies` + `company_private`, then set `company_id` and `is_company_admin = true`.
- Fall back to today's behaviour (profile with no company) when neither is supplied.

**5. Housekeeping**
- Remove the duplicate `profiles` SELECT/UPDATE policies (three identical selects, two identical updates) left over from earlier migrations.

## Frontend changes

- **`Register.tsx`** — add a company section: a search box backed by `search_companies` plus a "my company isn't listed" toggle that reveals name / address / org-number fields. Company choice is required. Pass it through `signUp` metadata and set `emailRedirectTo` to the app origin.
- **`AuthContext.signUp`** — accept and forward the company payload.
- **New "check your inbox" screen** after registration (replaces the `/company-registration` redirect), with a resend-confirmation button.
- **`/company-registration`** stays as a fallback for existing accounts that have no company, but now uses the RPC for search and writes only to `companies` + `company_private`.
- **`CompanySettings.tsx`** — reads/writes `companies` for name/address/org number and `company_private` for billing email; billing email + discount become company-admin-only edits.
- **`useOrderAddresses`, `OrderUtils`, `CheckoutOrderSummary`, `CheckoutInvoiceDetails`, `OrderCompanyInfoBox`** — fetch `discount_percentage` / `billing_email` from `company_private` instead of `companies`.
- **`generate-invoice` edge function** — join `company_private` for billing email.
- **Verification banner** on `/order` and `/checkout` for any signed-in but unverified account (legacy or future-proofing), with the checkout button disabled and a resend link.

## Notes and trade-offs

- Keeping Supabase's confirmation requirement on is what makes this safe: an unverified user literally has no token, so no amount of client tampering gets an order in.
- The trigger creating companies means a typo'd company name is created before the email is verified. Low risk, and admins can merge/rename from the dashboard; if you'd rather avoid orphan companies, I can add a nightly cleanup of companies whose only member never confirmed.
- No email domain is configured for this project, so confirmation emails currently go out from the default Lovable sender. Worth setting up a branded sender domain separately.
