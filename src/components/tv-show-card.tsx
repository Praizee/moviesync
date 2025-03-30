"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Heart, Star } from "lucide-react";
import type { TVShow } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useSupabase } from "@/components/supabase-provider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TVShowCardProps {
  show: TVShow;
}

export function TVShowCard({ show }: TVShowCardProps) {
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
        // Check if show is bookmarked
        const { data: bookmarkData } = await supabase
          .from("bookmarks")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("show_id", show.id)
          .single();

        setIsBookmarked(!!bookmarkData);

        // Check if show is favorited
        const { data: favoriteData } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("show_id", show.id)
          .single();

        setIsFavorite(!!favoriteData);
      } catch (error) {
        console.error(error);
        // Ignore errors (they'll occur if the show isn't bookmarked/favorited)
      } finally {
        setIsLoading(false);
      }
    }

    checkUserActions();
  }, [session, supabase, show.id]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Sign in required", {
        description: "Please sign in to bookmark shows",
      });
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`/api/user/bookmarks?showId=${show.id}`, {
          method: "DELETE",
        });

        toast.success("Bookmark removed", {
          description: `"${show.name}" has been removed from your bookmarks`,
        });
      } else {
        // Add bookmark
        await fetch("/api/user/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showId: show.id,
            showData: {
              id: show.id,
              name: show.name,
              poster_path: show.poster_path,
              first_air_date: show.first_air_date,
              overview: show.overview,
              media_type: "tv",
            },
          }),
        });

        toast.success("Show bookmarked", {
          description: `"${show.name}" has been added to your bookmarks`,
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
        description: "Please sign in to favorite shows",
      });
      return;
    }

    try {
      if (isFavorite) {
        // Remove favorite
        await fetch(`/api/user/favorites?showId=${show.id}`, {
          method: "DELETE",
        });

        toast.success("Favorite removed", {
          description: `"${show.name}" has been removed from your favorites`,
        });
      } else {
        // Add favorite
        await fetch("/api/user/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showId: show.id,
            showData: {
              id: show.id,
              name: show.name,
              poster_path: show.poster_path,
              first_air_date: show.first_air_date,
              overview: show.overview,
              media_type: "tv",
            },
          }),
        });

        toast.success("Show favorited", {
          description: `"${show.name}" has been added to your favorites`,
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
    <Link href={`/tv/${show.id}`} className="group relative">
      <div className="overflow-hidden rounded-lg">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
          {show.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
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
          {show.vote_average !== undefined && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md flex items-center text-xs font-medium">
              <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
              {show.vote_average?.toFixed(1)}
            </div>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          {show.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {show.first_air_date ? formatDate(show.first_air_date) : "TBA"}
        </p>
      </div>
    </Link>
  );
}

