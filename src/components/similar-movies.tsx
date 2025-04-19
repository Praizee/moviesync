import { MovieCard } from "@/components/movie-card";
import { getSimilarMovies } from "@/lib/tmdb";
import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Movie } from "@/lib/types";

interface SimilarMoviesProps {
  movieId: string;
}

export function SimilarMovies({ movieId }: SimilarMoviesProps) {
  return (
    <Suspense fallback={<MovieGridSkeleton count={5} />}>
      <SimilarMoviesContent movieId={movieId} />
    </Suspense>
  );
}

async function SimilarMoviesContent({ movieId }: { movieId: string }) {
  try {
    const similarMovies = await getSimilarMovies(movieId);

    if (!similarMovies.results || similarMovies.results.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No similar movies found.</p>
        </div>
      );
    }

    // Only show the first 5 similar movies
    const moviesToShow = similarMovies.results.slice(0, 5);

    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {moviesToShow.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {similarMovies.results.length > 5 && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link
                href={`/similar/movie/${movieId}`}
                className="flex items-center"
              >
                View All Similar Movies
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in SimilarMovies:", error);
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          Unable to load similar movies at this time.
        </p>
      </div>
    );
  }
}

