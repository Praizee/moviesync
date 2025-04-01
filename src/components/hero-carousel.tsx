"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { formatDate, formatRuntime } from "@/lib/utils";
import type {
  Movie,
  MovieDetails,
  CastMember,
  CrewMember,
  VideoItem,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeroCarouselProps {
  movies: Movie[];
  movieDetails: (MovieDetails | null)[];
}

export function HeroCarousel({ movies, movieDetails }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || isTrailerOpen) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % movies.length);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length, isTrailerOpen]);

  // Pause auto-rotation when user interacts
  const handleManualNavigation = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);

    // Resume auto-rotation after 30 seconds of inactivity
    const timeout = setTimeout(() => setIsAutoPlaying(true), 30000);
    return () => clearTimeout(timeout);
  };

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? movies.length - 1 : activeIndex - 1;
    handleManualNavigation(newIndex);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % movies.length;
    handleManualNavigation(newIndex);
  };

  if (!movies.length) {
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

  const currentMovie = movies[activeIndex];
  const currentDetails = movieDetails[activeIndex];

  // Extract director and cast from movie details
  let director = "Unknown Director";
  let cast: CastMember[] = [];
  let runtime = 0;
  let trailerKey: string | null = null;

  if (currentDetails) {
    // Find director
    const directorInfo = currentDetails.credits?.crew?.find(
      (person: CrewMember) => person.job === "Director"
    );
    if (directorInfo) {
      director = directorInfo.name;
    }

    // Get top cast
    cast = currentDetails.credits?.cast?.slice(0, 3) || [];

    // Get runtime
    runtime = currentDetails.runtime || 0;

    // Get trailer
    if (currentDetails.videos?.results) {
      const trailer = currentDetails.videos.results.find(
        (video: VideoItem) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      );
      if (trailer) {
        trailerKey = trailer.key;
      }
    }
  }

  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px]">
      {/* Main carousel */}
      <div className="aspect-[21/9] md:aspect-[3/1] relative">
        {currentMovie.backdrop_path ? (
          <Image
            sizes="100vw"
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            fill
            priority
            quality={100}
            className="object-cover object-center transition-opacity duration-1000 min-h-[500px] md:min-h-[600px] w-full"
            style={{ opacity: 1 }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 min-h-[500px] md:h-[600px]" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
        <div className="w-full max-w-screen-xl mx-auto sm:px-4">
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
              {currentMovie.title}
            </h1>

            {/* Additional details */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-white/90 text-sm">
              {currentMovie.vote_average && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                  <span>{currentMovie.vote_average.toFixed(1)}</span>
                </div>
              )}

              {runtime > 0 && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRuntime(runtime)}</span>
                </div>
              )}

              {currentMovie.release_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(currentMovie.release_date)}</span>
                </div>
              )}

              <div className="text-white/80">
                <span>Director: {director}</span>
              </div>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-4 text-white/80 text-sm">
                <span>Starring: </span>
                {cast.map((actor, index) => (
                  <span key={actor.id}>
                    {actor.name}
                    {index < cast.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm md:text-base text-white/80 line-clamp-3 mb-4 md:mb-6">
              {currentMovie.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/movies/${currentMovie.id}`}>View Details</Link>
              </Button>

              {trailerKey && (
                <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex gap-2 items-center"
                    >
                      <Play className="size-4" />
                      Watch Trailer
                    </Button>
                  </DialogTrigger>
                  <DialogTitle className="sr-only">Trailer</DialogTitle>

                  <DialogContent className="sm:max-w-[800px] p-0 border-4 border-primary/50 overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                        title={`${currentMovie.title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-y-0 left-0 hidden xl:flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 ml-4 cursor-pointer"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 hidden xl:flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 mr-4 cursor-pointer"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Indicators */}
      <div
        hidden // not really necessary...right?
        className="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
      >
        {movies.slice(0, 20).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === activeIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => handleManualNavigation(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

