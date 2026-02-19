import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabaseAdmin = createSupabaseAdminClient();
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Missing access token." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
    token
  );

  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid access token." }, { status: 401 });
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
      { error: "Store name and slug are required." },
      { status: 400 }
    );
  }

  const { data: existingProfile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  }

  const { data: tenant, error: tenantError } = await supabaseAdmin
    .from("tenants")
    .insert({ name, slug })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    return NextResponse.json(
      { error: tenantError?.message || "Failed to create tenant." },
      { status: 400 }
    );
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userData.user.id,
    tenant_id: tenant.id,
    role: "owner",
  });

  if (profileError) {
    // Rollback: Try to delete the tenant if profile creation fails
    await supabaseAdmin.from("tenants").delete().eq("id", tenant.id);
    return NextResponse.json(
      { error: profileError.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { ok: true, tenantId: tenant.id },
    {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    }
  );
}
