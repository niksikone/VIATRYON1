/**
 * Seeds demo products using images from the project's public/imgs folder.
 * Run from project root: node scripts/seed-demo-from-public.js
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Missing .env.local');
  process.exit(1);
}

const env = fs
  .readFileSync(envPath, 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const idx = line.indexOf('=');
    if (idx > 0) acc[line.slice(0, idx)] = line.slice(idx + 1);
    return acc;
  }, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const publicDir = path.join(__dirname, '..', 'public', 'imgs');
const demoImages = [
  { file: path.join(publicDir, 'watches', 'watch_1.png'), name: 'Classic Silver Watch', type: 'watch' },
  { file: path.join(publicDir, 'watches', 'watch_3.png'), name: 'Sport Gold Watch', type: 'watch' },
  { file: path.join(publicDir, 'bracelets', 'bracelet_1.png'), name: 'Elegant Chain Bracelet', type: 'bracelet' },
  { file: path.join(publicDir, 'bracelets', 'bracelet_2.png'), name: 'Diamond Tennis Bracelet', type: 'bracelet' },
  { file: path.join(publicDir, 'rings', 'ring_1.png'), name: 'Gold Diamond Ring', type: 'ring' },
];

const metadataByType = {
  watch: {
    watch_wearing_location: 0.4,
    watch_shadow_intensity: 0.15,
    watch_ambient_light_intensity: 1,
    watch_need_remove_background: false,
  },
  bracelet: {
    bracelet_wearing_location: 0.3,
    bracelet_shadow_intensity: 0.15,
    bracelet_ambient_light_intensity: 1,
    bracelet_need_remove_background: false,
  },
  ring: {
    ring_wearing_location: 0.3,
    ring_shadow_intensity: 0.15,
    ring_ambient_light_intensity: 1,
    ring_need_remove_background: false,
  },
};

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
    if (ins.error) {
      console.error('Failed to create tenant:', ins.error.message);
      process.exit(1);
    }
    tenant = ins.data;
  }

  const productIds = [];

  for (const { file, name, type } of demoImages) {
    if (!fs.existsSync(file)) {
      console.warn('Skip (file not found):', file);
      continue;
    }
    const buffer = fs.readFileSync(file);
    const baseName = path.basename(file);
    const storagePath = `${tenant.id}/demo/${baseName}`;

    const upload = await supabase.storage
      .from('jewelry-products')
      .upload(storagePath, buffer, { contentType: 'image/png', upsert: true });

    if (upload.error) {
      console.warn('Upload failed for', baseName, upload.error.message);
      continue;
    }

    const { data: urlData } = supabase.storage.from('jewelry-products').getPublicUrl(storagePath);
    const imageUrl = urlData.publicUrl;

    const insert = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name,
        type,
        image_url: imageUrl,
        price: null,
        metadata: metadataByType[type] || {},
        is_active: true,
      })
      .select('id')
      .single();

    if (insert.error) {
      console.warn('Insert failed for', name, insert.error.message);
      continue;
    }
    productIds.push(insert.data.id);
  }

  if (productIds.length === 0) {
    console.error('No products created. Check that public/imgs/watches and public/imgs/bracelets exist.');
    process.exit(1);
  }

  const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const hasKey = envLines.some((l) => l.startsWith('NEXT_PUBLIC_DEMO_PRODUCT_IDS='));
  const out = hasKey
    ? envLines.map((line) =>
        line.startsWith('NEXT_PUBLIC_DEMO_PRODUCT_IDS=')
          ? `NEXT_PUBLIC_DEMO_PRODUCT_IDS=${productIds.join(',')}`
          : line
      )
    : [...envLines, `NEXT_PUBLIC_DEMO_PRODUCT_IDS=${productIds.join(',')}`];
  fs.writeFileSync(envPath, out.join('\n'));

  console.log('Demo products created:', productIds.length);
  console.log('IDs:', productIds.join(','));
  console.log('Restart the dev server so NEXT_PUBLIC_DEMO_PRODUCT_IDS is picked up, then open /demo');
})();
