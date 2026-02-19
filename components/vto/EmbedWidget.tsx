"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import MobileVTO from "./MobileVTO";

type Product = {
  id: string;
  name: string | null;
  type: string;
  image_url: string | null;
  metadata: Record<string, number>;
};

const EmbedWidget = React.memo(({ product }: { product: Product }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTryOn = useCallback(() => {
    setShowModal(true);
  }, []);

  const normalizedProduct = useMemo(() => ({
    ...product,
    name: product.name ?? "Product",
    image_url: product.image_url ?? ""
  }), [product]);

  return (
    <>
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-lg overflow-hidden">
        {product.image_url && (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
            <Image
              src={product.image_url}
              alt={product.name || "Product"}
              fill
              className="object-contain"
              sizes="(max-width: 400px) 100vw, 400px"
            />
          </div>
        )}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Try on
          </p>
          <h2 className="text-lg font-semibold text-gray-900">{product.name ?? "Product"}</h2>
        </div>
        <button
          className="w-full rounded-lg bg-[#2D8C88] px-4 py-3 text-sm font-semibold text-white hover:bg-[#247a77] transition-colors"
          type="button"
          onClick={handleTryOn}
        >
          Try It On
        </button>
      </div>

      {showModal && product.image_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Try On {product.name ?? "Product"}</h3>
              <button
                className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                type="button"
                onClick={() => setShowModal(false)}
              >
                ✕ Close
              </button>
            </div>
            <MobileVTO product={normalizedProduct as any} />
          </div>
        </div>
      )}
    </>
  );
});

EmbedWidget.displayName = 'EmbedWidget';

export default EmbedWidget;
