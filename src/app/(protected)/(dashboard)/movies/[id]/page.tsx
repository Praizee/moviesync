import type { Metadata } from "next";
import Image from "next/image";
import { getMovieDetails } from "@/lib/tmdb";
import { MovieActions } from "@/components/movie-actions";
import { MovieTrailer } from "@/components/movie-trailer";
import { AuthCheck } from "@/components/auth-check";
import { formatDate, formatRuntime, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
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
    console.error(error);
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
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">
                    No poster available
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center">
              {movie.vote_average !== undefined && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({movie.vote_count} votes)
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
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
                      <MovieTrailer videos={movie?.videos?.results} />
                    </div>
                  )}

                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {movie.credits.cast.slice(0, 8).map((person) => (
                        <div key={person.id} className="text-center">
                          <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                            {person.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                alt={person.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground text-xs">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-sm">{person.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {person.character}
                          </p>
                        </div>
                      ))}
                    </div>
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

