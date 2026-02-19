export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
