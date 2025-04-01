import type { Metadata } from "next";
import Image from "next/image";
import { getMovieDetails } from "@/lib/tmdb";
import { MovieActions } from "@/components/movie-actions";
import { MovieTrailer } from "@/components/movie-trailer";
import { AuthCheck } from "@/components/auth-check";
import { formatDate, formatRuntime, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(params.id);
    return {
      title: `${movie.title} - MovieSync`,
      description: movie.overview,
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);

    return {
      title: "Movie - MovieSync",
      description: "View movie details",
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  try {
    const movie = await getMovieDetails(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  quality={90}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">
                    No poster available
                  </span>
                </div>
              )}
            </div>
            <div className="">
              <MovieActions movieId={params.id} movieData={movie} />
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-muted-foreground italic mb-4">
                {movie.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres &&
                movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Release Date</p>
                <p className="font-medium">{formatDate(movie.release_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Runtime</p>
                <p className="font-medium">{formatRuntime(movie.runtime)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{formatCurrency(movie.budget)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="font-medium">{formatCurrency(movie.revenue)}</p>
              </div>
            </div>

            <AuthCheck
              fallback={
                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900 rounded-lg mb-6">
                  <p className="text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">Sign in required.</span>{" "}
                    Please log in to view full movie details and trailer.
                  </p>
                </div>
              }
            >
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground">{movie.overview}</p>
                </div>

                {movie.videos &&
                  movie.videos.results &&
                  movie.videos.results.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                      <MovieTrailer videos={movie.videos.results} />
                    </div>
                  )}
              </>
            </AuthCheck>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);

    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Unable to load movie details
        </h1>
        <p className="text-muted-foreground mb-8">
          We&apos;re having trouble loading this movie&apos;s information. This
          could be due to a temporary issue.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }
}

