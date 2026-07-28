-- 1. company_private
CREATE TABLE public.company_private (
  company_id uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  discount_percentage integer NOT NULL DEFAULT 0,
  billing_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.company_private TO authenticated;
GRANT ALL ON public.company_private TO service_role;

ALTER TABLE public.company_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their company private data"
  ON public.company_private FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Company admins can update their company private data"
  ON public.company_private FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id() AND public.is_user_company_admin())
  WITH CHECK (company_id = public.get_user_company_id() AND public.is_user_company_admin());

CREATE POLICY "Admins can manage company private data"
  ON public.company_private FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER set_company_private_updated_at
  BEFORE UPDATE ON public.company_private
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- migrate existing values
INSERT INTO public.company_private (company_id, discount_percentage, billing_email)
SELECT id, COALESCE(discount_percentage, 0), billing_email FROM public.companies
ON CONFLICT (company_id) DO NOTHING;

ALTER TABLE public.companies DROP COLUMN discount_percentage;
ALTER TABLE public.companies DROP COLUMN billing_email;

-- 2. companies policies cleanup
DROP POLICY IF EXISTS "Users can view companies they belong to" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can view their own company" ON public.companies;
DROP POLICY IF EXISTS "Users can view their company" ON public.companies;
DROP POLICY IF EXISTS "Company members can update company" ON public.companies;
DROP POLICY IF EXISTS "Anyone can create companies" ON public.companies;

CREATE POLICY "Authenticated users can view companies"
  ON public.companies FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create companies"
  ON public.companies FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Company admins can update their company"
  ON public.companies FOR UPDATE TO authenticated
  USING ((id = public.get_user_company_id() AND public.is_user_company_admin()) OR public.is_admin())
  WITH CHECK ((id = public.get_user_company_id() AND public.is_user_company_admin()) OR public.is_admin());

-- 3. public company search usable before sign-in
CREATE OR REPLACE FUNCTION public.search_companies(q text)
RETURNS TABLE (id uuid, name text, address text, organization_number text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.address, c.organization_number
  FROM public.companies c
  WHERE length(btrim(coalesce(q, ''))) >= 2
    AND (c.name ILIKE '%' || btrim(q) || '%' OR c.organization_number ILIKE '%' || btrim(q) || '%')
  ORDER BY c.name
  LIMIT 20;
$$;

GRANT EXECUTE ON FUNCTION public.search_companies(text) TO anon, authenticated;

-- 4. profiles policy cleanup
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 5. signup trigger handles company selection / creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_company_id uuid;
  v_is_admin boolean := false;
  v_new_company jsonb;
BEGIN
  v_new_company := meta->'new_company';

  IF v_new_company IS NOT NULL AND COALESCE(v_new_company->>'name', '') <> '' THEN
    INSERT INTO public.companies (name, address, organization_number)
    VALUES (
      v_new_company->>'name',
      COALESCE(v_new_company->>'address', ''),
      COALESCE(v_new_company->>'organization_number', '')
    )
    RETURNING id INTO v_company_id;

    INSERT INTO public.company_private (company_id, discount_percentage)
    VALUES (v_company_id, 0)
    ON CONFLICT (company_id) DO NOTHING;

    v_is_admin := true;
  ELSIF COALESCE(meta->>'company_id', '') <> '' THEN
    BEGIN
      v_company_id := (meta->>'company_id')::uuid;
    EXCEPTION WHEN others THEN
      v_company_id := NULL;
    END;

    IF v_company_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.companies WHERE id = v_company_id) THEN
      v_company_id := NULL;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, email, phone, company_id, is_company_admin)
  VALUES (
    NEW.id,
    COALESCE(meta->>'first_name', ''),
    COALESCE(meta->>'last_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(meta->>'phone', ''),
    v_company_id,
    v_is_admin
  );

  RETURN NEW;
END;
$$;

-- 6. email verification backstop on ordering
CREATE OR REPLACE FUNCTION public.is_email_verified()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_email_verified() TO authenticated;

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Verified users can create their own orders"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_email_verified());

DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
CREATE POLICY "Verified users can insert their own order items"
  ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (
    public.is_email_verified()
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );