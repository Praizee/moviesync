import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="flex items-center"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>

      <Skeleton className="h-10 w-1/2 mb-6" />

      <MovieGridSkeleton count={20} />
    </div>
  );
}

