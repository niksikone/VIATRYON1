import DashboardNav from "@/components/dashboard/DashboardNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user
    ? !!(
        await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle()
      ).data
    : false;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="mb-6 text-sm font-semibold tracking-widest text-neutral-400">
            VIATRYON
          </div>
          <DashboardNav isAdmin={isAdmin} />
        </aside>
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          {children}
        </section>
      </div>
    </div>
  );
}
