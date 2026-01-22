const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = fs
  .readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const idx = line.indexOf('=');
    if (idx > 0) acc[line.slice(0, idx)] = line.slice(idx + 1);
    return acc;
  }, {});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const assetDir = 'C:/Users/Korisnik/Desktop/Assets';
const files = [
  '1761830250br-x3-night-vision-soldat-v3.avif',
  'Jacques-Philippe-sat-JPQGS621111-1.webp',
  'sports-watch-seiko-5-skx-gmt-black-dial-date-removebg-preview.png',
];

const metadata = {
  watch_wearing_location: 0.4,
  watch_shadow_intensity: 0.15,
  watch_ambient_light_intensity: 1,
};

const mimeFor = (f) => {
  if (f.endsWith('.avif')) return 'image/avif';
  if (f.endsWith('.webp')) return 'image/webp';
  if (f.endsWith('.png')) return 'image/png';
  return 'image/jpeg';
};

const titleize = (name) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (s) => s.toUpperCase());

(async () => {
  const slug = 'viatryon-demo';
  let { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (!tenant) {
    const ins = await supabase
      .from('tenants')
      .insert({ name: 'VIATRYON Demo', slug, is_active: true })
      .select('id')
      .single();
    tenant = ins.data;
  }

  if (!tenant) throw new Error('Failed to ensure demo tenant');

  const productIds = [];

  for (const file of files) {
    const filePath = path.join(assetDir, file);
    const buffer = fs.readFileSync(filePath);
    const storagePath = `${tenant.id}/demo/${file}`;

    const upload = await supabase.storage
      .from('jewelry-products')
      .upload(storagePath, buffer, { contentType: mimeFor(file), upsert: true });

    if (upload.error) throw upload.error;

    const publicUrl = supabase.storage
      .from('jewelry-products')
      .getPublicUrl(storagePath);

    const name = titleize(file);

    const insert = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name,
        type: 'watch',
        image_url: publicUrl.data.publicUrl,
        price: null,
        metadata,
        is_active: true,
      })
      .select('id')
      .single();

    if (insert.error) throw insert.error;
    productIds.push(insert.data.id);
  }

  const lines = fs.readFileSync('.env.local', 'utf8').split(/\r?\n/);
  const out = lines.map((line) =>
    line.startsWith('NEXT_PUBLIC_DEMO_PRODUCT_IDS=')
      ? `NEXT_PUBLIC_DEMO_PRODUCT_IDS=${productIds.join(',')}`
      : line
  );
  fs.writeFileSync('.env.local', out.join('\n'));

  console.log('Demo products created:', productIds.join(','));
})();
