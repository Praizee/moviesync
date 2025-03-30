"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Clock, Calendar } from "lucide-react";
import { formatDate, formatRuntime } from "@/lib/utils";
import { Movie, MovieDetails } from "@/lib/types";

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieDetails, setMovieDetails] = useState<
    Record<number, MovieDetails>
  >({});

  // Rotate movies every 87seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [movies.length]);

  // Fetch details for the current movie if not already fetched
  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movie = movies[currentIndex];
      if (!movieDetails[movie.id]) {
        try {
          const response = await fetch(`/api/movie-details?id=${movie.id}`);
          const details = await response.json();
          setMovieDetails((prev) => ({
            ...prev,
            [movie.id]: details,
          }));
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
        }
      }
    };

    fetchMovieDetails();
  }, [currentIndex, movies, movieDetails]);

  const featuredMovie = movies[currentIndex];
  const details = movieDetails[featuredMovie.id] || {};

  const runtime = details.runtime || 0;

  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px]">
      {/* Movie backdrop */}
      <div className="aspect-[21/9] md:aspect-[3/1] relative">
        {featuredMovie.backdrop_path ? (
          <Image
            sizes="100vw"
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            priority
            quality={100}
            fill
            // height={900}
            // width={1200}
            className="object-cover object-center transition-opacity duration-1000 min-h-[500px] md:min-h-[600px] w-full"
            style={{ opacity: 1 }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 min-h-[500px] md:h-[600px]" />
      </div>

      {/* Movie info */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
        <div className="w-full max-w-screen-xl mx-auto sm:px-4">
          <div className="max-w-md">
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
            </div>

            <p className="text-sm md:text-base text-white/80 line-clamp-3 mb-4 md:mb-6">
              {featuredMovie.overview}
            </p>
            <Button asChild size="lg">
              <Link href={`/movies/${featuredMovie.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div
        hidden
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
      >
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`size-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

