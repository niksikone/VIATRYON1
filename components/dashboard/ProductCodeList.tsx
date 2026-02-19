"use client";

type Product = {
  id: string;
  name: string | null;
};

export default function ProductCodeList({ products }: { products: Product[] }) {
  const copy = (id: string) => {
    navigator.clipboard.writeText(`<div data-viatryon="${id}"></div>`);
  };

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#1F2937] truncate">
              {p.name}
            </p>
            <code className="text-xs text-[#4B5563] font-mono">
              {`<div data-viatryon="${p.id}"></div>`}
            </code>
          </div>
          <button
            className="ml-3 flex-shrink-0 text-xs font-medium text-[#2D8C88] hover:text-[#F28C38] transition-colors"
            onClick={() => copy(p.id)}
            type="button"
          >
            Copy
          </button>
        </div>
      ))}
    </div>
  );
}
