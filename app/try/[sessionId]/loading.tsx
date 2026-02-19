export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB] flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-4">
        <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse mx-auto" />
        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
