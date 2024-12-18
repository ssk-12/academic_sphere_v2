import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="animate-pulse space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        {/* Content Skeletons */}
        <div className="space-y-6">
          {/* Text block skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Image skeleton */}
          <div className="flex items-center justify-center">
            <div className="h-48 w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          </div>

          {/* List skeleton */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex items-center justify-center">
          <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
