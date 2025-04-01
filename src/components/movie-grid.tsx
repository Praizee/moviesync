import { MovieCard } from "@/components/movie-card";
import { getMovies } from "@/lib/tmdb";
import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { Suspense } from "react";
import { Movie } from "@/lib/types";

interface MovieGridProps {
  type: "popular" | "top_rated" | "upcoming" | "now_playing";
  page?: number;
}

export function MovieGrid({ type, page = 1 }: MovieGridProps) {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <MovieGridContent type={type} page={page} />
    </Suspense>
  );
}

async function MovieGridContent({
  type,
  page,
}: {
  type: string;
  page: number;
}) {
  try {
    const movies = await getMovies(type, page);

    if (!movies.results || movies.results.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No movies available at the moment. Please try again later.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 min-[250px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.results.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error in MovieGrid:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Unable to load movies at this time. Please try again later.
        </p>
      </div>
    );
  }
}

