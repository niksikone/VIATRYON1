"use client";

import React, { useState, useCallback, useMemo, lazy, Suspense } from "react";
import Image from "next/image";

const QRCodeDisplay = lazy(() => import("@/components/vto/QRCodeDisplay"));

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
  (typeof window !== "undefined" ? window.location.origin : "https://yourapp.com");

const ProductsTable = React.memo(({ products }: { products: Product[] }) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState<string | null>(null);
  const [loadingCopy, setLoadingCopy] = useState<string | null>(null);

  const handleQr = useCallback(async (productId: string) => {
    setMessage(null);
    setLoadingQr(productId);
    
    try {
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
    } catch (error) {
      setMessage("Error generating QR code.");
    } finally {
      setLoadingQr(null);
    }
  }, []);

  const handleCopyEmbed = useCallback(async (productId: string) => {
    setLoadingCopy(productId);
    
    try {
      const appUrl = getAppUrl();
      const embedUrl = `${appUrl}/widget/${productId}`;
      const snippet = `<iframe src="${embedUrl}" style="border:0;width:100%;max-width:420px;height:640px;" allow="camera;"></iframe>`;
      await navigator.clipboard.writeText(snippet);
      setMessage("Embed code copied to clipboard!");
    } catch (error) {
      setMessage("Failed to copy. Please check clipboard permissions.");
    } finally {
      setLoadingCopy(null);
    }
  }, []);

  const handleCloseQr = useCallback(() => {
    setQrUrl(null);
  }, []);

  const isError = useMemo(
    () => message ? (message.includes("Failed") || message.includes("Error")) : false,
    [message]
  );

  if (!products.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-12 text-center">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-[#1F2937] font-medium mb-2">No products yet</p>
        <p className="text-[#4B5563] text-sm">
          Create your first product to generate embeds and QR codes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-3 ${
          isError
            ? "border-red-300 bg-red-50 text-red-800"
            : "border-[#2D8C88]/30 bg-[#2D8C88]/5 text-[#2D8C88]"
        }`}>
          {isError ? (
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#2D8C88] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          <span>{message}</span>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 mb-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[#1F2937] truncate">{product.name}</h3>
                <p className="text-xs uppercase tracking-wider text-[#4B5563] font-medium">
                  {product.type}
                </p>
                {product.price && (
                  <p className="text-sm text-[#2D8C88] font-semibold mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center gap-2 rounded-lg border border-[#2D8C88]/30 bg-[#2D8C88]/5 px-3 py-2 text-xs font-medium text-[#2D8C88] hover:bg-[#2D8C88] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => handleQr(product.id)}
                disabled={!!loadingQr}
              >
                {loadingQr === product.id ? (
                  <>
                    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Get QR code
                  </>
                )}
              </button>
              
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => handleCopyEmbed(product.id)}
                disabled={!!loadingCopy}
              >
                {loadingCopy === product.id ? (
                  <>
                    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Copying...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy embed
                  </>
                )}
              </button>
              
              <a
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-[#4B5563] hover:bg-gray-50 transition-all"
                href={`/widget/${product.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {qrUrl && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2D8C88]" /></div>}>
          <QRCodeDisplay value={qrUrl} onClose={handleCloseQr} />
        </Suspense>
      )}
    </div>
  );
});

ProductsTable.displayName = 'ProductsTable';

export default ProductsTable;
