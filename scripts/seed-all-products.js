/**
 * Seeds ALL demo products from public/imgs folder
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

// Get all images
const watchesDir = path.join(publicDir, 'watches');
const braceletsDir = path.join(publicDir, 'bracelets');
const ringsDir = path.join(publicDir, 'rings');

const watches = fs.existsSync(watchesDir) ? fs.readdirSync(watchesDir).filter(f => f.endsWith('.png')) : [];
const bracelets = fs.existsSync(braceletsDir) ? fs.readdirSync(braceletsDir).filter(f => f.endsWith('.png')) : [];
const rings = fs.existsSync(ringsDir) ? fs.readdirSync(ringsDir).filter(f => f.endsWith('.png')) : [];

const metadata = {
  watch_wearing_location: 0.4,
  watch_shadow_intensity: 0.15,
  watch_ambient_light_intensity: 1,
};

const generateProductName = (type, index) => {
  const names = {
    watch: ['Classic Elegance Watch', 'Sports Watch', 'Luxury Timepiece', 'Modern Watch', 'Vintage Watch', 'Premium Watch'],
    bracelet: ['Diamond Bracelet', 'Gold Bracelet', 'Silver Chain Bracelet', 'Elegant Bracelet', 'Tennis Bracelet', 'Statement Bracelet'],
    ring: ['Diamond Ring', 'Engagement Ring', 'Wedding Band', 'Statement Ring', 'Eternity Ring', 'Gemstone Ring']
  };
  return names[type][index % names[type].length] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`;
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

  console.log(`🔥 Seeding products for tenant: ${tenant.id}`);

  const productIds = [];
  let totalCreated = 0;

  // Process watches
  for (let i = 0; i < Math.min(watches.length, 6); i++) {
    const file = path.join(watchesDir, watches[i]);
    const buffer = fs.readFileSync(file);
    const storagePath = `${tenant.id}/watches/${watches[i]}`;

    const upload = await supabase.storage
      .from('jewelry-products')
      .upload(storagePath, buffer, { contentType: 'image/png', upsert: true });

    if (upload.error) {
      console.warn('Upload failed for', watches[i], upload.error.message);
      continue;
    }

    const { data: urlData } = supabase.storage.from('jewelry-products').getPublicUrl(storagePath);

    const insert = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name: generateProductName('watch', i),
        type: 'watch',
        image_url: urlData.publicUrl,
        price: Math.floor(Math.random() * 5000) + 500,
        metadata,
        is_active: true,
      })
      .select('id')
      .single();

    if (!insert.error) {
      productIds.push(insert.data.id);
      totalCreated++;
      console.log(`✓ Created watch: ${generateProductName('watch', i)}`);
    }
  }

  // Process bracelets
  for (let i = 0; i < Math.min(bracelets.length, 6); i++) {
    const file = path.join(braceletsDir, bracelets[i]);
    const buffer = fs.readFileSync(file);
    const storagePath = `${tenant.id}/bracelets/${bracelets[i]}`;

    const upload = await supabase.storage
      .from('jewelry-products')
      .upload(storagePath, buffer, { contentType: 'image/png', upsert: true });

    if (upload.error) {
      console.warn('Upload failed for', bracelets[i], upload.error.message);
      continue;
    }

    const { data: urlData } = supabase.storage.from('jewelry-products').getPublicUrl(storagePath);

    const insert = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name: generateProductName('bracelet', i),
        type: 'bracelet',
        image_url: urlData.publicUrl,
        price: Math.floor(Math.random() * 3000) + 300,
        metadata,
        is_active: true,
      })
      .select('id')
      .single();

    if (!insert.error) {
      productIds.push(insert.data.id);
      totalCreated++;
      console.log(`✓ Created bracelet: ${generateProductName('bracelet', i)}`);
    }
  }

  // Process rings
  for (let i = 0; i < Math.min(rings.length, 6); i++) {
    const file = path.join(ringsDir, rings[i]);
    const buffer = fs.readFileSync(file);
    const storagePath = `${tenant.id}/rings/${rings[i]}`;

    const upload = await supabase.storage
      .from('jewelry-products')
      .upload(storagePath, buffer, { contentType: 'image/png', upsert: true });

    if (upload.error) {
      console.warn('Upload failed for', rings[i], upload.error.message);
      continue;
    }

    const { data: urlData } = supabase.storage.from('jewelry-products').getPublicUrl(storagePath);

    const insert = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name: generateProductName('ring', i),
        type: 'ring',
        image_url: urlData.publicUrl,
        price: Math.floor(Math.random() * 4000) + 200,
        metadata,
        is_active: true,
      })
      .select('id')
      .single();

    if (!insert.error) {
      productIds.push(insert.data.id);
      totalCreated++;
      console.log(`✓ Created ring: ${generateProductName('ring', i)}`);
    }
  }

  console.log(`\n🎉 Successfully created ${totalCreated} products!`);
  console.log(`📦 Total product IDs: ${productIds.length}`);
  console.log('\n✅ Refresh your browser to see the products on the home page!');
})();
