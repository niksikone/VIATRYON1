import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

type SessionRow = {
  product_id: string;
  status: string;
  created_at: string;
};

type TenantOption = { id: string; name: string; slug: string };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const { tenant: tenantParam } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const supabaseAdmin = createSupabaseAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: profile }, { data: adminRow }] = await Promise.all([
    supabaseAdmin.from("profiles").select("tenant_id,role").eq("id", user.id).maybeSingle(),
    supabaseAdmin.from("admin_users").select("id").eq("id", user.id).maybeSingle(),
  ]);

  const isAdmin = !!adminRow;

  // Admin can pick any tenant; regular users see their own
  let activeTenantId = profile?.tenant_id || null;
  let tenantOptions: TenantOption[] = [];

  if (isAdmin) {
    const { data: allTenants } = await supabaseAdmin
      .from("tenants")
      .select("id,name,slug")
      .eq("is_active", true)
      .order("name");
    tenantOptions = allTenants || [];

    if (tenantParam && tenantOptions.some((t) => t.id === tenantParam)) {
      activeTenantId = tenantParam;
    } else if (!activeTenantId && tenantOptions.length > 0) {
      activeTenantId = tenantOptions[0].id;
    }
  }

  // Fetch data for selected tenant
  const [sessionsResult, productsResult, tenantResult] = await Promise.all([
    supabaseAdmin
      .from("vto_sessions")
      .select("product_id,status,created_at")
      .eq("tenant_id", activeTenantId || ""),
    supabaseAdmin
      .from("products")
      .select("id,name,type")
      .eq("tenant_id", activeTenantId || ""),
    supabaseAdmin
      .from("tenants")
      .select("name,api_units")
      .eq("id", activeTenantId || "")
      .maybeSingle(),
  ]);

  const sessions = sessionsResult.data || [];
  const products = productsResult.data || [];
  const tenant = tenantResult.data;

  // Compute per-product stats with status breakdown
  const productStats: Record<string, { total: number; success: number; error: number; pending: number }> = {};
  for (const s of sessions) {
    if (!productStats[s.product_id]) {
      productStats[s.product_id] = { total: 0, success: 0, error: 0, pending: 0 };
    }
    const stats = productStats[s.product_id];
    stats.total++;
    if (s.status === "success") stats.success++;
    else if (s.status === "error") stats.error++;
    else stats.pending++;
  }

  // Aggregate totals
  const totals = sessions.reduce(
    (acc, s) => {
      acc.total++;
      if (s.status === "success") acc.success++;
      else if (s.status === "error") acc.error++;
      else acc.pending++;
      return acc;
    },
    { total: 0, success: 0, error: 0, pending: 0 }
  );

  const successRate = totals.total > 0 ? Math.round((totals.success / totals.total) * 100) : 0;

  const activeTenantName = tenantOptions.find((t) => t.id === activeTenantId)?.name || tenant?.name || "Your Store";

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-2">Analytics</h1>
        <p className="text-[#4B5563]">
          Track try-on usage, success rates, and performance.
        </p>
      </div>

      {/* Admin tenant selector */}
      {isAdmin && tenantOptions.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-[#4B5563]">Store:</span>
          <div className="flex gap-2 flex-wrap">
            {tenantOptions.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/analytics?tenant=${t.id}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  t.id === activeTenantId
                    ? "bg-[#2D8C88] text-white shadow-sm"
                    : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
                }`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#4B5563] uppercase tracking-wider mb-1">Total Try-Ons</p>
          <p className="text-2xl font-bold text-[#1F2937]">{totals.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#4B5563] uppercase tracking-wider mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-600">{totals.success}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#4B5563] uppercase tracking-wider mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-500">{totals.error}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#4B5563] uppercase tracking-wider mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-[#2D8C88]">{successRate}%</p>
        </div>
      </div>

      {/* API Units */}
      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#4B5563]">API Units Remaining — {activeTenantName}</p>
            <p className="text-xs text-[#4B5563] mt-1">Each successful try-on uses 1 unit.</p>
          </div>
          <span className="text-3xl font-bold text-[#2D8C88]">
            {tenant?.api_units ?? 0}
          </span>
        </div>
      </div>

      {/* Per-product breakdown */}
      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6">
        <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Per-Product Breakdown</h2>
        <div className="space-y-3">
          {products.map((product) => {
            const stats = productStats[product.id] || { total: 0, success: 0, error: 0, pending: 0 };
            const rate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
            return (
              <div
                key={product.id}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-[#1F2937]">{product.name}</span>
                    <span className="ml-2 text-xs text-[#4B5563] uppercase">{product.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1F2937]">
                    {stats.total} total
                  </span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-green-600 font-medium">{stats.success} success</span>
                  <span className="text-red-500 font-medium">{stats.error} failed</span>
                  <span className="text-amber-500 font-medium">{stats.pending} pending</span>
                  <span className="text-[#2D8C88] font-medium ml-auto">{rate}% success rate</span>
                </div>
                {stats.total > 0 && (
                  <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {!products.length && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-[#1F2937] font-medium mb-2">No products yet</p>
              <p className="text-[#4B5563] text-sm">
                {isAdmin
                  ? "Select a store above or add products to see analytics."
                  : "Create a product to see analytics here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
