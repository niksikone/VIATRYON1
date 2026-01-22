"use client";

import { useState } from "react";
import Image from "next/image";
import QRCodeDisplay from "@/components/vto/QRCodeDisplay";

type Product = {
  id: string;
  name: string;
  type: string;
  image_url: string;
  price: number | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
};

const getAppUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export default function ProductsTable({ products }: { products: Product[] }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleQr = async (productId: string) => {
    setMessage(null);
    const response = await fetch("/api/qr/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      setMessage("Failed to generate QR code.");
      return;
    }

    const data = await response.json();
    setQrUrl(data.url);
  };

  const handleCopyEmbed = async (productId: string) => {
    const embedUrl = `${getAppUrl()}/widget/${productId}`;
    const snippet = `<iframe src="${embedUrl}" style="border:0;width:100%;max-width:420px;height:640px;" allow="camera;"></iframe>`;
    await navigator.clipboard.writeText(snippet);
    setMessage("Embed code copied.");
  };

  if (!products.length) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-300">
        No products yet. Create your first product to generate embeds and QR
        codes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-300">
          {message}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4"
          >
            <div className="flex gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-neutral-900">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  {product.type}
                </p>
                {product.price && (
                  <p className="text-sm text-neutral-300">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200"
                type="button"
                onClick={() => handleQr(product.id)}
              >
                Get QR code
              </button>
              <button
                className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200"
                type="button"
                onClick={() => handleCopyEmbed(product.id)}
              >
                Copy embed code
              </button>
              <a
                className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200"
                href={`/widget/${product.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Preview widget
              </a>
            </div>
          </div>
        ))}
      </div>
      {qrUrl && <QRCodeDisplay value={qrUrl} onClose={() => setQrUrl(null)} />}
    </div>
  );
}
