import AdminTenantForm from "@/components/dashboard/AdminTenantForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

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

  // Reuse admin client to fetch tenants with product counts

  const { data: tenants } = await supabaseAdmin
    .from("tenants")
    .select("id,name,slug,created_at,is_active,api_units")
    .order("created_at", { ascending: false });

  // Fetch product counts per tenant in parallel
  const tenantIds = (tenants || []).map((t) => t.id);
  let productCounts: Record<string, number> = {};

  if (tenantIds.length > 0) {
    const { data: counts } = await supabaseAdmin
      .from("products")
      .select("tenant_id")
      .in("tenant_id", tenantIds);

    if (counts) {
      productCounts = counts.reduce<Record<string, number>>((acc, row) => {
        acc[row.tenant_id] = (acc[row.tenant_id] || 0) + 1;
        return acc;
      }, {});
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-2">Stores</h1>
        <p className="text-[#4B5563]">
          Create and manage jewelry stores. Click a store to add products and get widget codes.
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6">
        <AdminTenantForm />
      </div>
      <div className="space-y-3">
        {(tenants || []).map((tenant) => (
          <Link
            key={tenant.id}
            href={`/dashboard/admin/${tenant.id}`}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm hover:shadow-md hover:border-[#2D8C88]/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D8C88]/10 text-[#2D8C88] font-bold text-lg group-hover:bg-[#2D8C88] group-hover:text-white transition-colors">
                {tenant.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div>
                <div className="font-semibold text-[#1F2937] group-hover:text-[#2D8C88] transition-colors">{tenant.name}</div>
                <div className="text-xs text-[#4B5563]">/{tenant.slug}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-[#4B5563]">Products</div>
                <div className="font-semibold text-[#1F2937]">{productCounts[tenant.id] || 0}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4B5563]">API Units</div>
                <div className="font-semibold text-[#1F2937]">{tenant.api_units ?? 0}</div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                tenant.is_active
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-gray-50 text-gray-500 border border-gray-200"
              }`}>
                {tenant.is_active ? "Active" : "Inactive"}
              </span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#2D8C88] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
        {!tenants?.length && (
          <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-12 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <p className="text-[#1F2937] font-medium mb-2">No stores yet</p>
            <p className="text-[#4B5563] text-sm">
              Create your first jewelry store above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
