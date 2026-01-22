"use client";

import EmbedWidget from "@/components/vto/EmbedWidget";

type Product = {
  id: string;
  name: string;
  type: string;
  image_url: string;
  metadata: Record<string, number>;
};

export default function PublicTryOn({ product }: { product: Product }) {
  return (
    <div className="flex w-full justify-center">
      <EmbedWidget product={product} />
    </div>
  );
}
