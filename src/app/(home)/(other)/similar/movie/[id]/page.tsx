import { getSimilarMovies, getMovieDetails } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Movie } from "@/lib/types";

interface SimilarMoviesPageProps {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function SimilarMoviesPage({
  params,
  searchParams,
}: SimilarMoviesPageProps) {
  const page = Number(searchParams.page) || 1;
  const movieId = params.id;

  try {
    // Get the original movie details for the title
    const movieDetails = await getMovieDetails(movieId);
    const similarMovies = await getSimilarMovies(movieId, page);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/movies/${movieId}`} className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to {movieDetails.title}
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">
          Movies Similar to &quot;{movieDetails.title}&quot;
        </h1>

        {similarMovies.results && similarMovies.results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {similarMovies.results.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={similarMovies.total_pages}
              baseUrl={`/similar/movie/${movieId}`}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No similar movies found for &quot;{movieDetails.title}&quot;.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/movies/${movieId}`}>Back to Movie</Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in SimilarMoviesPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Similar Movies</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Unable to load similar movies at this time.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
}

