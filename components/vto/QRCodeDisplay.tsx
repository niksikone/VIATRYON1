"use client";

import QRCode from "react-qr-code";

type QRCodeDisplayProps = {
  value: string;
  onClose: () => void;
};

export default function QRCodeDisplay({ value, onClose }: QRCodeDisplayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Scan to Try On</h3>
          <button
            className="text-sm text-neutral-400"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="rounded-xl bg-white p-4">
          <QRCode value={value} size={220} />
        </div>
        <p className="mt-4 text-xs text-neutral-400">
          This QR code opens the mobile try-on page.
        </p>
      </div>
    </div>
  );
}
