-- 005: Security hardening for SaaS readiness
-- Fixes: tenants_create policy, storage scoping, atomic unit deduction

-- 1. Restrict tenant creation to platform admins only
DROP POLICY IF EXISTS "tenants_create" ON public.tenants;
CREATE POLICY "tenants_create"
  ON public.tenants
  FOR INSERT
  WITH CHECK (public.is_platform_admin());

-- 2. Scope storage uploads to tenant paths
-- Drop the overly permissive storage policies
DROP POLICY IF EXISTS "storage_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_delete" ON storage.objects;

-- Recreate with path-based tenant scoping:
-- Authenticated users can only write to paths starting with their tenant_id
CREATE POLICY "storage_tenant_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id IN ('jewelry-products', 'vto-captures')
    AND auth.role() = 'authenticated'
    AND (
      -- Platform admins can write anywhere
      public.is_platform_admin()
      OR
      -- Regular users can only write under their tenant's folder
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND (storage.foldername(name))[1] = p.tenant_id::text
      )
    )
  );

CREATE POLICY "storage_tenant_update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id IN ('jewelry-products', 'vto-captures')
    AND auth.role() = 'authenticated'
    AND (
      public.is_platform_admin()
      OR
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND (storage.foldername(name))[1] = p.tenant_id::text
      )
    )
  );

CREATE POLICY "storage_tenant_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id IN ('jewelry-products', 'vto-captures')
    AND auth.role() = 'authenticated'
    AND (
      public.is_platform_admin()
      OR
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND (storage.foldername(name))[1] = p.tenant_id::text
      )
    )
  );

-- 3. Atomic API unit deduction function (prevents race conditions)
CREATE OR REPLACE FUNCTION public.deduct_api_unit(p_tenant_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.tenants
  SET api_units = api_units - 1
  WHERE id = p_tenant_id
  AND api_units > 0;
$$;
