export function CredorTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Skeleton */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-6 py-4 grid grid-cols-12 gap-4">
          <div className="col-span-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
          </div>
          <div className="col-span-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
          <div className="col-span-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="col-span-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>

      {/* Rows Skeleton */}
      <div className="divide-y divide-gray-200">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
            <div className="col-span-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="col-span-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
            </div>
            <div className="col-span-1 flex gap-2 justify-end">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
