import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const slug = body?.slug?.trim();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required." },
      { status: 400 }
    );
  }

  const { data: tenant, error } = await supabase
    .from("tenants")
    .insert({ name, slug })
    .select("id")
    .single();

  if (error || !tenant) {
    return NextResponse.json(
      { error: error?.message || "Failed to create tenant." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, tenantId: tenant.id });
}

// Ensure TypeScript treats this as a module
export {};