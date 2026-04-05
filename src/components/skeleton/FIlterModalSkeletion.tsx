import { Skeleton } from "@/components/ui/skeleton";
import { X, Plus } from "lucide-react";

export function FilterModalSkeleton() {
  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <X className="h-5 w-5 text-gray-400" />
      </div>

      {/* Blog Category Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Filter Options Area */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 p-6 pt-4">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}
