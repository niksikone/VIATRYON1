"use client";

import { useState } from "react";
import MobileVTO from "./MobileVTO";

type Product = {
  id: string;
  name: string;
  type: string;
  image_url: string;
  metadata: Record<string, number>;
};

export default function EmbedWidget({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false);

  const handleTryOn = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-white">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Try on
          </p>
          <h2 className="text-lg font-semibold">{product.name}</h2>
        </div>
        <button
          className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
          type="button"
          onClick={handleTryOn}
        >
          Try It On
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Try On {product.name}</h3>
              <button
                className="rounded-lg px-3 py-1 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800"
                type="button"
                onClick={() => setShowModal(false)}
              >
                ✕ Close
              </button>
            </div>
            <MobileVTO product={product} />
          </div>
        </div>
      )}
    </>
  );
}
