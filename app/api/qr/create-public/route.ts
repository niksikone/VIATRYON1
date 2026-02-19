import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const supabaseAdmin = createSupabaseAdminClient();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const productId = body?.productId as string | undefined;

  if (
    !productId ||
    typeof productId !== "string" ||
    productId.length > 50 ||
    !/^[0-9a-f-]+$/i.test(productId)
  ) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id,tenant_id,is_active")
    .eq("id", productId)
    .maybeSingle();

  if (!product || !product.is_active) {
    return NextResponse.json({ error: "Invalid product" }, { status: 404 });
  }

  // Check tenant has units remaining before creating session
  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("api_units,is_active")
    .eq("id", product.tenant_id)
    .single();

  if (!tenant?.is_active) {
    return NextResponse.json({ error: "Store is inactive" }, { status: 403 });
  }

  if ((tenant.api_units ?? 0) <= 0) {
    return NextResponse.json(
      { error: "This store has no try-on credits remaining." },
      { status: 403 }
    );
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
  const url = `${appUrl}/try/${session.id}`;

  return NextResponse.json(
    { sessionId: session.id, url },
    {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    }
  );
}
