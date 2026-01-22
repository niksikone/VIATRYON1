create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  subscription_tier text not null default 'free',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  type text not null check (type in ('watch', 'ring', 'bracelet')),
  image_url text not null,
  price numeric,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vto_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  task_id text,
  status text not null default 'pending' check (status in ('pending', 'success', 'error')),
  result_url text,
  source_image_url text,
  error_message text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('superadmin', 'support')),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users(id) on delete cascade,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_settings (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  branding jsonb not null default '{}'::jsonb,
  widget_config jsonb not null default '{}'::jsonb,
  contact_email text,
  updated_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  label text not null,
  public_key text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.admin_users au where au.id = auth.uid()
  );
$$;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.vto_sessions enable row level security;
alter table public.admin_users enable row level security;
alter table public.audit_log enable row level security;
alter table public.tenant_settings enable row level security;
alter table public.api_keys enable row level security;

create policy "profiles_self_read"
  on public.profiles
  for select
  using (id = auth.uid() or public.is_platform_admin());

create policy "profiles_self_write"
  on public.profiles
  for insert
  with check (id = auth.uid() or public.is_platform_admin());

create policy "profiles_self_update"
  on public.profiles
  for update
  using (id = auth.uid() or public.is_platform_admin());

create policy "tenants_member_read"
  on public.tenants
  for select
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = tenants.id and p.id = auth.uid()
  ));

create policy "tenants_member_update"
  on public.tenants
  for update
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = tenants.id and p.id = auth.uid()
  ));

create policy "tenants_create"
  on public.tenants
  for insert
  with check (auth.uid() is not null);

create policy "products_tenant_read"
  on public.products
  for select
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = products.tenant_id and p.id = auth.uid()
  ));

create policy "products_public_read_active"
  on public.products
  for select
  using (is_active = true);

create policy "products_tenant_write"
  on public.products
  for insert
  with check (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = products.tenant_id and p.id = auth.uid()
  ));

create policy "products_tenant_update"
  on public.products
  for update
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = products.tenant_id and p.id = auth.uid()
  ));

create policy "products_tenant_delete"
  on public.products
  for delete
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = products.tenant_id and p.id = auth.uid()
  ));

create policy "vto_sessions_tenant_read"
  on public.vto_sessions
  for select
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = vto_sessions.tenant_id and p.id = auth.uid()
  ));

create policy "vto_sessions_tenant_write"
  on public.vto_sessions
  for insert
  with check (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = vto_sessions.tenant_id and p.id = auth.uid()
  ));

create policy "vto_sessions_tenant_update"
  on public.vto_sessions
  for update
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = vto_sessions.tenant_id and p.id = auth.uid()
  ));

create policy "admin_users_manage"
  on public.admin_users
  for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "audit_log_manage"
  on public.audit_log
  for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "tenant_settings_read"
  on public.tenant_settings
  for select
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = tenant_settings.tenant_id and p.id = auth.uid()
  ));

create policy "tenant_settings_write"
  on public.tenant_settings
  for insert
  with check (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = tenant_settings.tenant_id and p.id = auth.uid()
  ));

create policy "tenant_settings_update"
  on public.tenant_settings
  for update
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = tenant_settings.tenant_id and p.id = auth.uid()
  ));

create policy "api_keys_read"
  on public.api_keys
  for select
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = api_keys.tenant_id and p.id = auth.uid()
  ));

create policy "api_keys_write"
  on public.api_keys
  for insert
  with check (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = api_keys.tenant_id and p.id = auth.uid()
  ));

create policy "api_keys_update"
  on public.api_keys
  for update
  using (public.is_platform_admin() or exists (
    select 1 from public.profiles p
    where p.tenant_id = api_keys.tenant_id and p.id = auth.uid()
  ));

insert into storage.buckets (id, name, public)
values ('jewelry-products', 'jewelry-products', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('vto-captures', 'vto-captures', true)
on conflict (id) do nothing;

create policy "storage_public_read"
  on storage.objects
  for select
  using (bucket_id in ('jewelry-products', 'vto-captures'));

create policy "storage_authenticated_insert"
  on storage.objects
  for insert
  with check (bucket_id in ('jewelry-products', 'vto-captures') and auth.role() = 'authenticated');

create policy "storage_authenticated_update"
  on storage.objects
  for update
  using (bucket_id in ('jewelry-products', 'vto-captures') and auth.role() = 'authenticated');

create policy "storage_authenticated_delete"
  on storage.objects
  for delete
  using (bucket_id in ('jewelry-products', 'vto-captures') and auth.role() = 'authenticated');
