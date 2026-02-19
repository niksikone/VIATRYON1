export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
            <div className="h-12 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-7 bg-gray-200 rounded w-1/3 animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-5 bg-gray-200 rounded flex-1 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
