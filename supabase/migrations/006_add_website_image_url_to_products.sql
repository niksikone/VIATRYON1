-- Optional link to the same product image on the client's website (reference/source).
alter table public.products
  add column if not exists website_image_url text;
