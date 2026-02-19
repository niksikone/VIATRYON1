import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: adminRow } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const name = body?.name?.trim();
  const slug = body?.slug?.trim();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required." },
      { status: 400 }
    );
  }

  if (name.length > 100 || slug.length > 100) {
    return NextResponse.json(
      { error: "Name and slug must be under 100 characters." },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must contain only lowercase letters, numbers, and hyphens." },
      { status: 400 }
    );
  }

  const { data: tenant, error } = await supabaseAdmin
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

  return NextResponse.json(
    { ok: true, tenantId: tenant.id },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}