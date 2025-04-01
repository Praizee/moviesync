"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/components/supabase-provider";
import type { TVShow } from "@/lib/types";

interface TVShowActionsProps {
  showId: string;
  showData: TVShow;
}

export function TVShowActions({ showId, showData }: TVShowActionsProps) {
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
          .eq("show_id", showId)
          .single();

        setIsBookmarked(!!bookmarkData);

        // Check if show is favorited
        const { data: favoriteData } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("show_id", showId)
          .single();

        setIsFavorite(!!favoriteData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    checkUserActions();
  }, [session, supabase, showId]);

  const handleBookmark = async () => {
    if (!session) {
      toast.error("Sign in required", {
        description: "Please sign in to bookmark shows",
      });
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`/api/user/bookmarks?showId=${showId}`, {
          method: "DELETE",
        });

        toast.success("Bookmark removed", {
          description: `"${showData.name}" has been removed from your bookmarks`,
        });
      } else {
        // Add bookmark
        await fetch("/api/user/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ showId, showData }),
        });

        toast.success("Show bookmarked", {
          description: `"${showData.name}" has been added to your bookmarks`,
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

  const handleFavorite = async () => {
    if (!session) {
      toast.error("Sign in required", {
        description: "Please sign in to favorite shows",
      });
      return;
    }

    try {
      if (isFavorite) {
        // Remove favorite
        await fetch(`/api/user/favorites?showId=${showId}`, {
          method: "DELETE",
        });

        toast.success("Favorite removed", {
          description: `"${showData.name}" has been removed from your favorites`,
        });
      } else {
        // Add favorite
        await fetch("/api/user/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ showId, showData }),
        });

        toast.success("Show favorited", {
          description: `"${showData.name}" has been added to your favorites`,
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

  if (isLoading) {
    return (
      <div className="grid min-[300px]:grid-cols-2 gap-2">
        <Button variant="outline" disabled className="flex-1">
          <Bookmark className="mr-2 h-4 w-4" />
          Bookmark
        </Button>
        <Button variant="outline" disabled className="flex-1">
          <Heart className="mr-2 h-4 w-4" />
          Favorite
        </Button>
      </div>
    );
  }

  return (
    <div className="grid min-[300px]:grid-cols-2 gap-2">
      <Button
        variant={isBookmarked ? "default" : "outline"}
        onClick={handleBookmark}
        className="flex-1"
      >
        <Bookmark className="mr-2 h-4 w-4" />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
      <Button
        variant={isFavorite ? "default" : "outline"}
        onClick={handleFavorite}
        className="flex-1"
      >
        <Heart className="mr-2 h-4 w-4" />
        {isFavorite ? "Favorited" : "Favorite"}
      </Button>
    </div>
  );
}

