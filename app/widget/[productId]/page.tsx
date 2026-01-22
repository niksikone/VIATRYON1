import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EmbedWidget from "@/components/vto/EmbedWidget";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function WidgetPage({ params }: PageProps) {
  const { productId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id,name,type,image_url,metadata,is_active")
    .eq("id", productId)
    .maybeSingle();

  if (!product || !product.is_active) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <EmbedWidget product={product} />
    </div>
  );
}
