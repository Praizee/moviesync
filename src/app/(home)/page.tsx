import Link from "next/link";
import { MovieGrid } from "@/components/movie-grid";
import { TVShowGrid } from "@/components/tv-show-grid";
import { HeroSection } from "@/components/hero-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto pb-8">
      <HeroSection />

      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mt-12 mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Popular Movies
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/popular?type=movies" className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <MovieGrid type="popular" />

        <div className="mt-12 mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Popular TV Shows
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/popular?type=tv" className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <TVShowGrid type="popular" />

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Discover More
            </h2>
          </div>
          <Tabs defaultValue="movies" className="w-full mt-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
            </TabsList>
            <TabsContent value="movies">
              <div className="grid gap-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Top Rated Movies</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href="/top-rated?type=movies"
                        className="flex items-center"
                      >
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <MovieGrid type="top_rated" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Trending Movies</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href="/trending?type=movies"
                        className="flex items-center"
                      >
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <MovieGrid type="upcoming" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tvshows">
              <div className="grid gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      Top Rated TV Shows
                    </h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href="/top-rated?type=tv"
                        className="flex items-center"
                      >
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <TVShowGrid type="top_rated" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Trending TV Shows</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href="/trending?type=tv"
                        className="flex items-center"
                      >
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <TVShowGrid type="on_the_air" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

