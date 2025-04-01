import { TVShowCard } from "@/components/tv-show-card";
import { getTVShows } from "@/lib/tmdb";
import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { Suspense } from "react";
import { TVShow } from "@/lib/types";

interface TVShowGridProps {
  type: "popular" | "top_rated" | "on_the_air" | "airing_today";
  page?: number;
}

export function TVShowGrid({ type, page = 1 }: TVShowGridProps) {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <TVShowGridContent type={type} page={page} />
    </Suspense>
  );
}

async function TVShowGridContent({
  type,
  page,
}: {
  type: string;
  page: number;
}) {
  try {
    const shows = await getTVShows(type, page);

    if (!shows.results || shows.results.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No TV shows available at the moment. Please try again later.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 min-[250px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"> */}
        {shows.results.map((show: TVShow) => (
          <TVShowCard key={show.id} show={show} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error in TVShowGrid:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Unable to load TV shows at this time. Please try again later.
        </p>
      </div>
    );
  }
}

