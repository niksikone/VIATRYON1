import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductsTable from "@/components/vto/ProductsTable";

export default async function ProductsPage() {
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

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="text-sm text-neutral-300">
        Product management is restricted to platform admins.
      </div>
    );
  }

  const tenantId = profile?.tenant_id;
  const { data: products } = await supabase
    .from("products")
    .select("id,name,type,image_url,price,is_active,created_at,metadata")
    .eq("tenant_id", tenantId || "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-neutral-400">
            Manage jewelry and generate embeds or QR codes.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          New product
        </Link>
      </div>
      <ProductsTable products={products || []} />
    </div>
  );
}
