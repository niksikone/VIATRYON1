"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type MobileCameraProps = {
  onCapture: (file: File) => void;
  disabled?: boolean;
};

declare global {
  interface Window {
    YMK?: any;
    ymkAsyncInit?: () => void;
  }
}

export default function MobileCamera({ onCapture, disabled }: MobileCameraProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureCallbackRef = useRef(onCapture);

  captureCallbackRef.current = onCapture;

  useEffect(() => {
    window.ymkAsyncInit = function () {
      if (!window.YMK) return;

      window.YMK.addEventListener("loaded", () => {});

      window.YMK.addEventListener("faceDetectionCaptured", async function (capturedResult: any) {
        if (!capturedResult.images || capturedResult.images.length === 0) {
          setIsCapturing(false);
          window.YMK.close();
          return;
        }

        const image = capturedResult.images[0].image;
        
        if (!image) {
          setIsCapturing(false);
          window.YMK.close();
          return;
        }
        
        try {
          let blob: Blob;
          
          if (typeof image === "string") {
            const base64Data = image.split(",")[1] || image;
            if (!base64Data || base64Data.length < 100) {
              setIsCapturing(false);
              window.YMK.close();
              return;
            }
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: "image/jpeg" });
          } else {
            if (image.size < 1000) {
              setIsCapturing(false);
              window.YMK.close();
              return;
            }
            blob = image;
          }

          if (!blob || blob.size < 1000) {
            setIsCapturing(false);
            window.YMK.close();
            return;
          }

          const file = new File([blob], "wrist-capture.jpg", { type: "image/jpeg" });
          
          if (captureCallbackRef.current && file.size > 1000) {
            captureCallbackRef.current(file);
          }
          
          window.YMK.close();
          setIsCapturing(false);
        } catch {
          setIsCapturing(false);
          window.YMK.close();
        }
      });

      window.YMK.addEventListener("cameraFailed", function (error: any) {
        setIsCapturing(false);
        alert(`Camera error: ${error.code || error.message || "Unknown error"}. Please try again.`);
        window.YMK.close();
      });

      window.YMK.addEventListener("closed", function () {
        setIsCapturing(false);
      });

      setSdkLoaded(true);
    };
  }, []);

  const openCamera = () => {
    if (!window.YMK || disabled) return;
    
    setIsCapturing(true);
    
    try {
      window.YMK.init({
        faceDetectionMode: "wrist",
        imageFormat: "base64",
        language: "enu",
        disableCameraResolutionCheck: true,
      });
      
      window.YMK.openCameraKit();
    } catch {
      setIsCapturing(false);
    }
  };

  return (
    <>
      <Script
        src="https://plugins-media.makeupar.com/v2.2-camera-kit/sdk.js"
        onLoad={() => {
          if (window.ymkAsyncInit) {
            window.ymkAsyncInit();
          }
        }}
      />
      
      <div className="space-y-3">
        <div id="YMK-module" className="min-h-[120px]" />
        
        {!isCapturing && sdkLoaded && (
          <button
            type="button"
            onClick={openCamera}
            disabled={disabled}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            📸 Open Professional Wrist Camera
          </button>
        )}
        
        {/* Fallback for HTTP/iOS */}
        <input
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
          type="file"
          accept="image/*"
          capture="environment"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file && captureCallbackRef.current) {
              captureCallbackRef.current(file);
            }
          }}
        />
        
        {!sdkLoaded && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center text-sm text-neutral-400">
            Loading camera module...
          </div>
        )}
        
        <p className="text-xs text-neutral-400">
          Position your wrist with all five fingers visible for best results.
        </p>
      </div>
    </>
  );
}
