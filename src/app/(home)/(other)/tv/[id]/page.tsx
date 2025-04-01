import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTVShowDetails } from "@/lib/tmdb";
import { MovieTrailer } from "@/components/movie-trailer";
import { TVShowActions } from "@/components/tv-show-actions";
import { AuthCheck } from "@/components/auth-check";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface TVShowPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: TVShowPageProps): Promise<Metadata> {
  try {
    const show = await getTVShowDetails(params.id);
    return {
      title: `${show.name} - MovieSync`,
      description: show.overview,
    };
  } catch (error) {
    console.error("Error fetching show details:", error);
    return {
      title: "TV Show - MovieSync",
      description: "View TV show details",
    };
  }
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  try {
    const show = await getTVShowDetails(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group">
              {show.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  fill
                  className="object-cover duration-300 group-hover:scale-105"
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
            <div className="mt-4 flex items-center justify-between">
              {show.vote_average !== undefined && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {show.vote_average.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({show.vote_count} votes)
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <TVShowActions showId={params.id} showData={show} />
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{show.name}</h1>
            {show.tagline && (
              <p className="text-xl text-muted-foreground italic mb-4">
                {show.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres &&
                show.genres.map((genre) => (
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
                <p className="text-sm text-muted-foreground">First Air Date</p>
                <p className="font-medium">{formatDate(show.first_air_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seasons</p>
                <p className="font-medium">{show.number_of_seasons}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Episodes</p>
                <p className="font-medium">{show.number_of_episodes}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Episode Runtime</p>
                <p className="font-medium">
                  {show.episode_run_time && show.episode_run_time.length > 0
                    ? `${show.episode_run_time[0]} min`
                    : "N/A"}
                </p>
              </div>
            </div>

            <AuthCheck
              fallback={
                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900 rounded-lg mb-6">
                  <p className="text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">Sign in required.</span>{" "}
                    Please log in to view full TV show details and trailer.
                  </p>
                </div>
              }
            >
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground">{show.overview}</p>
                </div>

                {show.videos &&
                  show.videos.results &&
                  show.videos.results.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                      <MovieTrailer videos={show?.videos.results} />
                    </div>
                  )}

                {show.credits?.cast && show.credits.cast.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {show.credits.cast.slice(0, 8).map((person) => (
                        <div key={person.id} className="text-center">
                          <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                            {person.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                alt={person.name}
                                fill
                                className="object-cover"
                                quality={90}
                                priority
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
          Unable to load TV show details
        </h1>
        <p className="text-muted-foreground mb-8">
          We&apos;re having trouble loading this TV show&apos;s information.
          This could be due to a temporary issue.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }
}

