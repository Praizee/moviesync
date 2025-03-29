import { getMovies } from "@/lib/tmdb";
import { HeroCarousel } from "./hero-carousel";
import { Button } from "./ui/button";
import Link from "next/link";

export async function HeroSection() {
  try {
    const movies = await getMovies("popular", 1);

    // Check if we have results
    if (!movies.results || movies.results.length === 0) {
      return <DefaultHero />;
    }

    // Get first 10 movies
    const featuredMovies = movies.results.slice(0, 10);

    return <HeroCarousel movies={featuredMovies} />;
  } catch (error) {
    return <DefaultHero />;
  }
}

function DefaultHero() {
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

