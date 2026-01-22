"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="flex flex-col gap-4 text-sm">
      {isAdmin && (
        <a className="text-white" href="/dashboard/products">
          Products
        </a>
      )}
      <a className="text-neutral-400" href="/dashboard/analytics">
        Analytics
      </a>
      {isAdmin && (
        <a className="text-neutral-400" href="/dashboard/admin">
          Tenants
        </a>
      )}
      <button
        className="rounded-lg border border-neutral-800 px-3 py-2 text-left text-neutral-300"
        onClick={signOut}
        type="button"
      >
        Sign out
      </button>
    </nav>
  );
}
