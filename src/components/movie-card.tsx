"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Heart, Star } from "lucide-react";
import type { Movie } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useSupabase } from "@/components/supabase-provider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { supabase, session } = useSupabase();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserActions() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if movie is bookmarked
        const { data: bookmarkData } = await supabase
          .from("bookmarks")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("movie_id", movie.id)
          .single();

        setIsBookmarked(!!bookmarkData);

        // Check if movie is favorited
        const { data: favoriteData } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("movie_id", movie.id)
          .single();

        setIsFavorite(!!favoriteData);
      } catch (error) {
        console.error(error);
        // Ignore errors (they'll occur if the movie isn't bookmarked/favorited)
      } finally {
        setIsLoading(false);
      }
    }

    checkUserActions();
  }, [session, supabase, movie.id]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Sign in required", {
        description: "Please sign in to bookmark movies",
      });
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`/api/user/bookmarks?movieId=${movie.id}`, {
          method: "DELETE",
        });

        toast.success("Bookmark removed", {
          description: `"${movie.title}" has been removed from your bookmarks`,
        });
      } else {
        // Add bookmark
        await fetch("/api/user/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: movie.id,
            movieData: {
              ...movie,
              media_type: "movie",
            },
          }),
        });

        toast.success("Movie bookmarked", {
          description: `"${movie.title}" has been added to your bookmarks`,
        });
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to update bookmark",
      });
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Sign in required", {
        description: "Please sign in to favorite movies",
      });
      return;
    }

    try {
      if (isFavorite) {
        // Remove favorite
        await fetch(`/api/user/favorites?movieId=${movie.id}`, {
          method: "DELETE",
        });

        toast.success("Favorite removed", {
          description: `"${movie.title}" has been removed from your favorites`,
        });
      } else {
        // Add favorite
        await fetch("/api/user/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: movie.id,
            movieData: {
              ...movie,
              media_type: "movie",
            },
          }),
        });

        toast.success("Movie favorited", {
          description: `"${movie.title}" has been added to your favorites`,
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to update favorite",
      });
    }
  };

  return (
    <Link href={`/movies/${movie.id}`} className="group relative">
      <div className="overflow-hidden rounded-lg">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={90}
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {/* Rating Badge */}
          {movie.vote_average !== undefined && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md flex items-center text-xs font-medium">
              <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/70 hover:bg-black/90"
              onClick={handleBookmark}
              disabled={isLoading}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isBookmarked ? "fill-primary text-primary" : "text-white"
                }`}
              />
              <span className="sr-only">Bookmark</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/70 hover:bg-black/90"
              onClick={handleFavorite}
              disabled={isLoading}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-primary text-primary" : "text-white"
                }`}
              />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {movie.release_date ? formatDate(movie.release_date) : "TBA"}
        </p>
      </div>
    </Link>
  );
}

