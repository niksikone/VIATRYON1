import AdminTenantForm from "@/components/dashboard/AdminTenantForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: adminRow } = await supabase
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

  const { data: tenants } = await supabase
    .from("tenants")
    .select("id,name,slug,created_at,is_active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <p className="text-sm text-neutral-400">
          Create and manage jewelry stores.
        </p>
      </div>
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <AdminTenantForm />
      </div>
      <div className="space-y-3">
        {(tenants || []).map((tenant) => (
          <div
            key={tenant.id}
            className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm"
          >
            <div>
              <div className="font-semibold">{tenant.name}</div>
              <div className="text-xs text-neutral-400">/{tenant.slug}</div>
            </div>
            <span className="text-xs text-neutral-400">
              {tenant.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
        {!tenants?.length && (
          <p className="text-sm text-neutral-400">No tenants yet.</p>
        )}
      </div>
    </div>
  );
}
