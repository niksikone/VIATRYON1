import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabaseAdmin = createSupabaseAdminClient();
  const body = await request.json().catch(() => null);
  const productId = body?.productId as string | undefined;

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id,tenant_id,is_active")
    .eq("id", productId)
    .maybeSingle();

  if (!product || !product.is_active) {
    return NextResponse.json({ error: "Invalid product" }, { status: 404 });
  }

  const { data: session, error } = await supabaseAdmin
    .from("vto_sessions")
    .insert({
      tenant_id: product.tenant_id,
      product_id: product.id,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !session) {
    return NextResponse.json(
      { error: error?.message || "Failed to create session" },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const url = `${appUrl}/try/${session.id}`;

  return NextResponse.json({ sessionId: session.id, url });
}
