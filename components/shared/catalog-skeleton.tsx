export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden">
          <div className="aspect-square bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}