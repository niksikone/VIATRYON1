"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const DashboardNav = React.memo(({ isAdmin }: { isAdmin: boolean }) => {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);

  return (
    <button
      onClick={signOut}
      type="button"
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#1F2937] bg-gray-100 hover:bg-[#2D8C88] hover:text-white transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Sign out
    </button>
  );
});

DashboardNav.displayName = 'DashboardNav';

export default DashboardNav;
