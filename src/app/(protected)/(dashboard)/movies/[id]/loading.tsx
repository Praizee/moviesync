import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="mt-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-4" />

          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <Skeleton className="h-8 w-32 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="mb-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="aspect-video w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

