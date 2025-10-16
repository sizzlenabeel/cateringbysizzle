-- =====================================================
-- CRITICAL SECURITY FIXES
-- =====================================================

-- 1. FIX: Add explicit deny policy for anonymous access to orders table
CREATE POLICY "Deny anonymous access to orders"
ON public.orders 
FOR ALL
TO anon
USING (false);

-- 2. FIX: Remove public read access to companies table
DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;

-- Create restricted policy for authenticated users only
CREATE POLICY "Authenticated users can view their own company"
ON public.companies 
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- 3. FIX: Create separate user_roles table for admin role management
CREATE TYPE public.app_role AS ENUM ('admin', 'company_admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can manage roles
CREATE POLICY "Only admins can manage roles"
ON public.user_roles 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles 
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 4. FIX: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 5. FIX: Migrate existing admin flags to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles
WHERE is_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'company_admin'::public.app_role
FROM public.profiles
WHERE is_company_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. FIX: Update existing database functions to use proper search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_user_company_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'company_admin'::public.app_role);
$$;

-- Keep get_user_company_id but fix search_path
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 7. Add helper function for authorization checks in edge functions
CREATE OR REPLACE FUNCTION public.user_owns_order(_user_id uuid, _order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = _order_id AND user_id = _user_id
  );
$$;

-- Note: is_admin and is_company_admin columns will remain on profiles table
-- for backward compatibility but should no longer be used for authorization
-- All authorization should use the new user_roles table via has_role() function