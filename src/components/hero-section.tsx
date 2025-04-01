import { getMovies } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/hero-carousel";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { Suspense } from "react";
import { Movie } from "@/lib/types";

export async function HeroSection() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroContent />
    </Suspense>
  );
}

async function HeroContent() {
  try {
    // Fetch popular movies
    const movies = await getMovies("popular", 1);

    if (!movies.results || movies.results.length === 0) {
      return <HeroSkeleton />;
    }

    // Get first 20 movies
    const featuredMovies = movies.results.slice(0, 20);

    // Fetch additional details for each featured movie
    const detailsPromises = featuredMovies.map(async (movie: Movie) => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos`,
          { next: { revalidate: 3600 } }
        );

        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (error) {
        console.error(`Error fetching details for movie ${movie.id}:`, error);
        return null;
      }
    });

    const movieDetails = await Promise.all(detailsPromises);

    return <HeroCarousel movies={featuredMovies} movieDetails={movieDetails} />;
  } catch (error) {
    console.error("Error in HeroSection:", error);
    return <HeroSkeleton />;
  }
}

