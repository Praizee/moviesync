import { TVShowCard } from "@/components/tv-show-card";
import { getSimilarTVShows } from "@/lib/tmdb";
import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { TVShow } from "@/lib/types";

interface SimilarTVShowsProps {
  showId: string;
}

export function SimilarTVShows({ showId }: SimilarTVShowsProps) {
  return (
    <Suspense fallback={<MovieGridSkeleton count={5} />}>
      <SimilarTVShowsContent showId={showId} />
    </Suspense>
  );
}

async function SimilarTVShowsContent({ showId }: { showId: string }) {
  try {
    const similarShows = await getSimilarTVShows(showId);

    if (!similarShows.results || similarShows.results.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No similar TV shows found.</p>
        </div>
      );
    }

    // Only show the first 5 similar shows
    const showsToShow = similarShows.results.slice(0, 5);

    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {showsToShow.map((show: TVShow) => (
            <TVShowCard key={show.id} show={show} />
          ))}
        </div>

        {similarShows.results.length > 5 && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link
                href={`/similar/tv/${showId}`}
                className="flex items-center"
              >
                View All Similar TV Shows
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in SimilarTVShows:", error);
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          Unable to load similar TV shows at this time.
        </p>
      </div>
    );
  }
}

