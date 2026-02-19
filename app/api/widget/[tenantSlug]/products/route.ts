import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;

    if (!tenantSlug || tenantSlug.length > 100 || !/^[a-z0-9-]+$/.test(tenantSlug)) {
      return NextResponse.json(
        { error: "Invalid store identifier" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: tenant } = await supabase
      .from("tenants")
      .select("id,name")
      .eq("slug", tenantSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (!tenant) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const { data: products } = await supabase
      .from("products")
      .select("id,name,type,image_url,price")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    return NextResponse.json(
      { store: tenant.name, products: products || [] },
      { headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
