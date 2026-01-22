alter table public.tenants 
add column if not exists api_units integer not null default 0;

-- Set initial units for existing tenants (you can adjust this)
update public.tenants 
set api_units = 34 
where api_units = 0;
