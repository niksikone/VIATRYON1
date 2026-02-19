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

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const productId = body?.productId as string | undefined;

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  // Parallelize profile and product validation
  const [profileResult, productResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("products")
      .select("id,tenant_id,is_active")
      .eq("id", productId)
      .maybeSingle(),
  ]);

  const profile = profileResult.data;
  const product = productResult.data;

  if (!profile?.tenant_id) {
    return NextResponse.json({ error: "Missing tenant" }, { status: 400 });
  }

  if (!product || !product.is_active) {
    return NextResponse.json({ error: "Invalid or inactive product" }, { status: 404 });
  }

  if (product.tenant_id !== profile.tenant_id) {
    return NextResponse.json({ error: "Product does not belong to your tenant" }, { status: 403 });
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json(
      { error: "Server configuration error: APP_URL not set" },
      { status: 500 }
    );
  }
  const url = `${appUrl}/try/${session.id}`;

  return NextResponse.json(
    { sessionId: session.id, url },
    {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    }
  );
}
