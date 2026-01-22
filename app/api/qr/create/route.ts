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

  const body = await request.json().catch(() => null);
  const productId = body?.productId as string | undefined;

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.tenant_id) {
    return NextResponse.json({ error: "Missing tenant" }, { status: 400 });
  }

  const { data: session, error } = await supabase
    .from("vto_sessions")
    .insert({
      tenant_id: profile.tenant_id,
      product_id: productId,
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
