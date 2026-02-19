export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex gap-4 mb-4">
              <div className="h-20 w-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 bg-gray-200 rounded-lg flex-1 animate-pulse" />
              <div className="h-9 bg-gray-200 rounded-lg flex-1 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
