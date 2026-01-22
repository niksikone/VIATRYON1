import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import MobileVTO from "@/components/vto/MobileVTO";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function TryOnPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabaseAdmin = createSupabaseAdminClient();

  const { data: session } = await supabaseAdmin
    .from("vto_sessions")
    .select("id,product_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    notFound();
  }

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id,name,type,image_url,metadata,is_active")
    .eq("id", session.product_id)
    .maybeSingle();

  if (!product || !product.is_active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4 text-white">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Try on {product.name}</h1>
        <MobileVTO product={product} sessionId={session.id} />
      </div>
    </div>
  );
}
