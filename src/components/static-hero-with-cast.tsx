// static hero with movie cast (not responsive yet...need to update with current hero)

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMovies } from "@/lib/tmdb";
import { Star, Clock, Calendar } from "lucide-react";
import { formatDate, formatRuntime } from "@/lib/utils";

export async function HeroSection() {
  try {
    const movies = await getMovies("popular", 1);

    // Check if we have results
    if (!movies.results || movies.results.length === 0) {
      return (
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <div className="aspect-[21/9] md:aspect-[3/1] flex items-center justify-center">
            <div className="p-6 md:p-12 text-center">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                Welcome to MovieSync
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Discover, bookmark, and favorite your movies
              </p>
              <Button asChild size="lg">
                <Link href="/search">Search Movies</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    const featuredMovie = movies.results[0];

    // Fetch additional details for the featured movie
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${featuredMovie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`,
      { next: { revalidate: 3600 } }
    );

    let director = "Unknown Director";
    let cast = [];
    let runtime = 0;

    if (detailsResponse.ok) {
      const details = await detailsResponse.json();

      // Find director
      const directorInfo = details.credits?.crew?.find(
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        (person: any) => person.job === "Director"
      );

      if (directorInfo) {
        director = directorInfo.name;
      }

      // Get top cast
      cast = details.credits?.cast?.slice(0, 3) || [];

      // Get runtime
      runtime = details.runtime || 0;
    }

    return (
      <div className="relative overflow-hidden rounded-xl">
        <div className="aspect-[21/9] md:aspect-[3/1] relative">
          {featuredMovie.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
              {featuredMovie.title}
            </h1>

            {/* Additional details */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-white/90 text-sm">
              {featuredMovie.vote_average && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                  <span>{featuredMovie.vote_average.toFixed(1)}</span>
                </div>
              )}

              {runtime > 0 && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRuntime(runtime)}</span>
                </div>
              )}

              {featuredMovie.release_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(featuredMovie.release_date)}</span>
                </div>
              )}

              <div className="text-white/80">
                <span>Dir. {director}</span>
              </div>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-4 text-white/80 text-sm">
                <span>Starring: </span>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {cast.map((actor: any, index: number) => (
                  <span key={actor.id}>
                    {actor.name}
                    {index < cast.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm md:text-base text-white/80 line-clamp-3 mb-4 md:mb-6">
              {featuredMovie.overview}
            </p>
            <Button asChild size="lg">
              <Link href={`/movies/${featuredMovie.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    // Fallback UI in case of error
    return (
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <div className="aspect-[21/9] md:aspect-[3/1] flex items-center justify-center">
          <div className="p-6 md:p-12 text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              Welcome to MovieSync
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Discover, bookmark, and favorite your movies
            </p>
            <Button asChild size="lg">
              <Link href="/search">Search Movies</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

