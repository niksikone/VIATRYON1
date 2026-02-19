import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import ProductsTable from "@/components/vto/ProductsTable";

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const supabaseAdmin = createSupabaseAdminClient();

  const [profileResult, adminResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("tenant_id,role")
      .eq("id", user.id)
      .maybeSingle(),
    supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const profile = profileResult.data;
  const adminRow = adminResult.data;
  const isAdmin = !!adminRow;

  // Platform admins without a personal tenant manage products via Stores
  if (isAdmin && !profile?.tenant_id) {
    redirect("/dashboard/admin");
  }

  // Store owners and store admins can manage their tenant's products
  if (!isAdmin && (!profile || !["owner", "admin"].includes(profile.role))) {
    return (
      <div className="text-sm text-[#4B5563]">
        You don&apos;t have permission to manage products. Contact your store administrator.
      </div>
    );
  }

  const tenantId = profile?.tenant_id;

  if (!tenantId) {
    return (
      <div className="text-sm text-[#4B5563]">
        No store associated with your account. Contact your administrator.
      </div>
    );
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id,name,type,image_url,price,is_active,created_at,metadata")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-2">Products</h1>
          <p className="text-[#4B5563]">
            Manage your jewelry catalog and generate virtual try-on links
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 bg-[#2D8C88] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#F28C38] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>
      <ProductsTable products={products || []} />
    </div>
  );
}
