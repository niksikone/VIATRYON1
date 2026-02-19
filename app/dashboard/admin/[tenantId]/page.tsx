import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import ProductsTable from "@/components/vto/ProductsTable";
import ProductCodeList from "@/components/dashboard/ProductCodeList";

type PageProps = {
  params: Promise<{ tenantId: string }>;
};

export default async function TenantDetailPage({ params }: PageProps) {
  const { tenantId } = await params;
  const supabase = await createSupabaseServerClient();

  // Verify user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Use admin client to bypass RLS for admin check and cross-tenant access
  const supabaseAdmin = createSupabaseAdminClient();

  const { data: adminRow } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="text-sm text-neutral-300">
        You do not have access to this page.
      </div>
    );
  }

  // Fetch tenant and products in parallel
  const [tenantResult, productsResult] = await Promise.all([
    supabaseAdmin
      .from("tenants")
      .select("id,name,slug,created_at,is_active,api_units")
      .eq("id", tenantId)
      .maybeSingle(),
    supabaseAdmin
      .from("products")
      .select("id,name,type,image_url,price,is_active,created_at,metadata")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
  ]);

  const tenant = tenantResult.data;
  const products = productsResult.data || [];

  if (!tenant) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com";

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#4B5563]">
        <Link
          href="/dashboard/admin"
          className="hover:text-[#2D8C88] transition-colors"
        >
          Stores
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#1F2937] font-medium">{tenant.name}</span>
      </div>

      {/* Tenant Header */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2D8C88]/10 text-[#2D8C88] font-bold text-2xl">
            {tenant.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-[#1F2937]">
              {tenant.name}
            </h1>
            <p className="text-[#4B5563]">/{tenant.slug}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            tenant.is_active
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}
        >
          {tenant.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-4">
          <p className="text-xs uppercase tracking-wider text-[#4B5563] font-medium mb-1">Products</p>
          <p className="text-2xl font-bold text-[#1F2937]">{products.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-4">
          <p className="text-xs uppercase tracking-wider text-[#4B5563] font-medium mb-1">API Units</p>
          <p className="text-2xl font-bold text-[#1F2937]">{tenant.api_units ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-4">
          <p className="text-xs uppercase tracking-wider text-[#4B5563] font-medium mb-1">Created</p>
          <p className="text-sm font-semibold text-[#1F2937]">
            {new Date(tenant.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1F2937]">Products</h2>
            <p className="text-sm text-[#4B5563]">
              Manage products and generate widget codes for this store
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/admin/${tenant.id}/products/import`}
              className="flex items-center gap-2 border-2 border-[#2D8C88] text-[#2D8C88] px-5 py-2.5 rounded-full font-semibold hover:bg-[#2D8C88] hover:text-white transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import CSV
            </Link>
            <Link
              href={`/dashboard/admin/${tenant.id}/products/new`}
              className="flex items-center gap-2 bg-[#2D8C88] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>
        <ProductsTable products={products} />
      </div>

      {/* Widget Integration Section */}
      <div className="space-y-4 border-t border-gray-200 pt-8">
        <div>
          <h2 className="text-xl font-semibold text-[#1F2937]">Widget Integration</h2>
          <p className="text-sm text-[#4B5563]">
            Share these 2 steps with {tenant.name} to add virtual try-on to their entire website
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6 space-y-6">
          {/* Step 1: Script tag */}
          <div>
            <h3 className="font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2D8C88] text-white text-xs font-bold">1</span>
              Add the Viatryon script (once, site-wide)
            </h3>
            <p className="text-sm text-[#4B5563] ml-8 mb-3">
              Paste this line before the closing <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag in the site&apos;s theme or layout. This only needs to be done <strong>once</strong> for the whole store.
            </p>
            <div className="ml-8 rounded-lg border border-gray-300 bg-white p-4">
              <p className="text-xs font-medium text-[#4B5563] mb-2 uppercase tracking-wider">Script Tag — Copy This</p>
              <code className="block text-sm text-[#1F2937] whitespace-pre-wrap break-all font-mono bg-gray-50 rounded-lg p-3">
{`<script src="${appUrl}/vto-widget.js" data-tenant="${tenant.slug}"></script>`}
              </code>
            </div>
          </div>

          {/* Step 2: Product template line */}
          <div>
            <h3 className="font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2D8C88] text-white text-xs font-bold">2</span>
              Add one line to the product template
            </h3>
            <p className="text-sm text-[#4B5563] ml-8 mb-3">
              In the product page template, add the line below where you want the &quot;Try It On&quot; button to appear. The product name is filled automatically by the platform — this <strong>one line works for all products</strong>.
            </p>
            <div className="ml-8 space-y-3">
              <div className="rounded-lg border border-gray-300 bg-white p-4">
                <p className="text-xs font-medium text-[#2D8C88] mb-2 uppercase tracking-wider">Shopify</p>
                <code className="block text-sm text-[#1F2937] whitespace-pre-wrap break-all font-mono bg-gray-50 rounded-lg p-3">
{`<div data-viatryon-name="{{ product.title }}"></div>`}
                </code>
              </div>
              <div className="rounded-lg border border-gray-300 bg-white p-4">
                <p className="text-xs font-medium text-[#2D8C88] mb-2 uppercase tracking-wider">WooCommerce</p>
                <code className="block text-sm text-[#1F2937] whitespace-pre-wrap break-all font-mono bg-gray-50 rounded-lg p-3">
{`<div data-viatryon-name="<?php the_title(); ?>"></div>`}
                </code>
              </div>
              <div className="rounded-lg border border-gray-300 bg-white p-4">
                <p className="text-xs font-medium text-[#2D8C88] mb-2 uppercase tracking-wider">Custom / HTML</p>
                <code className="block text-sm text-[#1F2937] whitespace-pre-wrap break-all font-mono bg-gray-50 rounded-lg p-3">
{`<div data-viatryon-name="Product Name Here"></div>`}
                </code>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-[#1F2937] mb-2 text-sm">How it works</h4>
            <p className="text-sm text-[#4B5563]">
              The script automatically matches the product name on each page to your catalog. When a customer clicks &quot;Try It On&quot;, a popup opens with the AR try-on experience for <strong>that specific product</strong>. Works on any device — no app download needed. The customer never leaves the store&apos;s page.
            </p>
          </div>

          {/* Important note */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-[#1F2937] mb-2 text-sm">Important</h4>
            <p className="text-sm text-[#4B5563]">
              Product names in your catalog must match the product titles on {tenant.name}&apos;s website. The matching is case-insensitive and ignores extra spaces, so &quot;Gold Diamond Ring&quot; will match &quot;gold diamond ring&quot;.
            </p>
          </div>

          {/* Advanced: per-product codes */}
          {products.length > 0 && (
            <details className="border-t border-gray-200 pt-4">
              <summary className="font-medium text-[#1F2937] text-sm cursor-pointer hover:text-[#2D8C88] transition-colors">
                Advanced: Per-product codes ({products.length} products)
              </summary>
              <p className="text-sm text-[#4B5563] mt-2 mb-3">
                If the auto-match doesn&apos;t work for a product (name mismatch), you can use an explicit product ID instead:
              </p>
              <ProductCodeList products={products.map((p) => ({ id: p.id, name: p.name }))} />
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
