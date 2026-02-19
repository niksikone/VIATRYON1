import DashboardNav from "@/components/dashboard/DashboardNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use admin client to bypass RLS for admin check
  const supabaseAdmin = createSupabaseAdminClient();
  const isAdmin = user
    ? !!(
        await supabaseAdmin
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle()
      ).data
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/imgs/logo-only.png" 
                alt="ViaTryon" 
                width={32} 
                height={32} 
                priority
                className="h-8 w-8" 
              />
              <span className="font-serif text-xl font-medium text-[#1F2937] tracking-tight">
                ViaTryon
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-[#4B5563] hover:text-[#2D8C88] transition-colors">
                Back to Home
              </Link>
              <DashboardNav isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-24 shadow-sm">
            <div className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2D8C88] mb-4">
                Dashboard
              </h2>
              <nav className="space-y-2">
                {isAdmin && (
                  <Link
                    href="/dashboard/products"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#1F2937] hover:bg-[#2D8C88]/5 hover:text-[#2D8C88] transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Products
                  </Link>
                )}
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4B5563] hover:bg-[#2D8C88]/5 hover:text-[#2D8C88] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4B5563] hover:bg-[#2D8C88]/5 hover:text-[#2D8C88] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Stores
                  </Link>
                )}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
