"use client";

import { useEffect, useState } from "react";
import { MovieCard } from "@/components/movie-card";
import { TVShowCard } from "@/components/tv-show-card";
import type { Movie, TVShow } from "@/lib/types";
import { useSupabase } from "@/components/supabase-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FavoriteMovies() {
  const { supabase, session } = useSupabase();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await fetch("/api/user/favorites");

        if (!response.ok) {
          throw new Error(`Error fetching favorites: ${response.status}`);
        }

        const data = await response.json();
        console.log("Favorites data:", data);

        if (data?.favorites) {
          const movieItems: Movie[] = [];
          const showItems: TVShow[] = [];

          data.favorites.forEach((favorite: any) => {
            if (favorite.movie_id && favorite.movie_details) {
              movieItems.push({
                id: favorite.movie_id,
                title: favorite.movie_details.title,
                poster_path: favorite.movie_details.poster_path,
                release_date: favorite.movie_details.release_date,
                overview: favorite.movie_details.overview,
                vote_average: favorite.movie_details.vote_average,
                media_type: "movie",
              });
            } else if (favorite.show_id && favorite.show_details) {
              showItems.push({
                id: favorite.show_id,
                name: favorite.show_details.name,
                poster_path: favorite.show_details.poster_path,
                first_air_date: favorite.show_details.first_air_date,
                overview: favorite.show_details.overview,
                vote_average: favorite.show_details.vote_average,
                media_type: "tv",
              });
            }
          });

          setMovies(movieItems);
          setShows(showItems);
        }
      } catch (err: any) {
        console.error("Error fetching favorites:", err);
        setError(err.message || "Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavorites();

    // Set up a real-time subscription for favorites
    if (session) {
      const channel = supabase
        .channel("favorites-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "favorites",
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            fetchFavorites();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, supabase]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-destructive">
          Error Loading Favorites
        </h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (movies.length === 0 && shows.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No favorite items</h3>
        <p className="text-muted-foreground">
          Movies and TV shows you mark as favorite will appear here.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full mt-6">
      <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
        <TabsTrigger value="all">
          All ({movies.length + shows.length})
        </TabsTrigger>
        <TabsTrigger value="movies">Movies ({movies.length})</TabsTrigger>
        <TabsTrigger value="shows">TV Shows ({shows.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={`movie-${movie.id}`} movie={movie} />
          ))}
          {shows.map((show) => (
            <TVShowCard key={`show-${show.id}`} show={show} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="movies">
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No favorite movies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={`movie-${movie.id}`} movie={movie} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="shows">
        {shows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No favorite TV shows yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {shows.map((show) => (
              <TVShowCard key={`show-${show.id}`} show={show} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

