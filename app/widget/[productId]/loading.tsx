export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4 animate-pulse" />
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
