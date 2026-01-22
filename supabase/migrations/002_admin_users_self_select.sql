create policy "admin_users_self_select"
  on public.admin_users
  for select
  using (id = auth.uid());
