"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MobileCamera from "@/components/vto/MobileCamera";

type Product = {
  id: string;
  name: string;
  type: string;
  image_url: string;
  metadata: Record<string, number>;
};

type MobileVTOProps = {
  product: Product;
  sessionId?: string;
};

export default function MobileVTO({ product, sessionId }: MobileVTOProps) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessionId || null
  );
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId]);

  const ensureSession = async () => {
    if (currentSessionId) return currentSessionId;
    const response = await fetch("/api/qr/create-public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    if (!response.ok) {
      throw new Error("Failed to create session.");
    }
    const data = await response.json();
    setCurrentSessionId(data.sessionId);
    return data.sessionId as string;
  };

  const handleCapture = async (file: File) => {
    setStatus("processing");
    setError(null);

    try {
      const sessionIdValue = await ensureSession();
      const formData = new FormData();
      formData.append("sessionId", sessionIdValue);
      formData.append("productId", product.id);
      formData.append("file", file);

      const response = await fetch("/api/vto", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "VTO failed.");
      }

      console.log("[VTO] Result received:", payload.resultUrl);
      setResultUrl(payload.resultUrl);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "VTO failed.");
      setStatus("error");
    }
  };

  const handleRetakePhoto = () => {
    setStatus("idle");
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Product Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
        {product.type.toLowerCase() === "ring" 
          ? "Capture a clear image of your hand with fingers visible."
          : `Capture a clear image of your wrist with the ${product.type} area visible.`}
      </div>

      {/* Product Image */}
      <div className="relative h-40 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Camera Capture */}
      {status === "idle" && (
        <MobileCamera
          onCapture={handleCapture}
          disabled={false}
        />
      )}

      {/* Processing State */}
      {status === "processing" && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
          </div>
          <p className="text-sm font-medium text-gray-900">Processing your try-on...</p>
          <p className="mt-1 text-xs text-gray-500">This may take a few seconds</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {status === "done" && resultUrl && (
        <div className="space-y-4">
          {/* Result Image */}
          <div className="relative h-96 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <Image
              src={resultUrl}
              alt="Try-on result"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleRetakePhoto}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
