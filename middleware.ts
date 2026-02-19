import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const pathname = request.nextUrl.pathname;

  // Analytics is accessible to all authenticated users
  if (pathname.startsWith("/dashboard/analytics")) {
    return response;
  }

  // Use service role to bypass RLS for admin + profile checks
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const [{ data: adminRow }, { data: profile }] = await Promise.all([
    supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle(),
    supabaseAdmin
      .from("profiles")
      .select("tenant_id,role")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  // Platform admins have full access
  if (adminRow) {
    return response;
  }

  // Admin-only routes: /dashboard/admin/*
  if (pathname.startsWith("/dashboard/admin")) {
    const redirectUrl = new URL("/dashboard/analytics", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Store owners and admins can access product management for their tenant
  if (pathname.startsWith("/dashboard/products")) {
    if (profile && (profile.role === "owner" || profile.role === "admin")) {
      return response;
    }
    const redirectUrl = new URL("/dashboard/analytics", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
