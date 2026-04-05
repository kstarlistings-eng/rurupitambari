import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Container matching your p-10 white rounded box in the parent */}
      <div className="bg-white rounded-2xl shadow-sm p-10">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          {/* We generate 4-5 field skeletons to match your inputs */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 mb-[18px]">
              {/* Label Skeleton */}
              <Skeleton className="h-5 w-32" /> 
              {/* Input Skeleton */}
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>

        {/* Toggle Section Skeleton */}
        <div className="mt-10 flex items-center justify-between border-t pt-7">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}