import { createSupabaseServerClient } from "@/lib/supabase/server";

type SessionRow = {
  product_id: string;
  status: string;
};

export default async function AnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  const tenantId = profile?.tenant_id;

  const { data: sessions } = await supabase
    .from("vto_sessions")
    .select("product_id,status")
    .eq("tenant_id", tenantId || "");

  const { data: products } = await supabase
    .from("products")
    .select("id,name")
    .eq("tenant_id", tenantId || "");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("api_units")
    .eq("id", tenantId || "")
    .maybeSingle();

  const counts = (sessions || []).reduce<Record<string, number>>(
    (acc, row: SessionRow) => {
      acc[row.product_id] = (acc[row.product_id] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-neutral-400">
          Track try-on usage per product.
        </p>
      </div>
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-4">
          <span className="text-sm font-medium text-neutral-300">API Units</span>
          <span className="text-2xl font-bold text-white">
            {tenant?.api_units ?? 0}
          </span>
        </div>
        <p className="mb-4 text-xs text-neutral-400">
          Units are deducted when a VTO task is created. Each try-on uses 1 unit.
        </p>
        <div className="space-y-3">
          {(products || []).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm"
            >
              <span>{product.name}</span>
              <span className="text-neutral-300">
                {counts[product.id] || 0} sessions
              </span>
            </div>
          ))}
          {!products?.length && (
            <p className="text-sm text-neutral-400">
              No products yet. Create a product to see analytics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
