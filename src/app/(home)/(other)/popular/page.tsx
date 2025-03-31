import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMovies, getTVShows } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { TVShowCard } from "@/components/tv-show-card";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";
import Link from "next/link";
import { GridSkeleton } from "@/components/grid-skeleton";
import { Movie, TVShow } from "@/lib/types";

interface PopularPageProps {
  searchParams: {
    page?: string;
    type?: string;
  };
}

async function PopularContent({ type, page }: { type: string; page: number }) {
  const isMovies = type === "movies";
  const data = isMovies
    ? await getMovies("popular", page)
    : await getTVShows("popular", page);

  return (
    <>
      {data.results && data.results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isMovies
              ? data.results.map((movie: Movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              : data.results.map((show: TVShow) => (
                  <TVShowCard key={show.id} show={show} />
                ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            baseUrl={`/popular?type=${type}`}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No popular content available at the moment. Please try again later.
          </p>
        </div>
      )}
    </>
  );
}

export default async function PopularPage({ searchParams }: PopularPageProps) {
  const page = Number(searchParams.page) || 1;
  const type = searchParams.type || "movies";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Popular
      </h1>

      <Tabs defaultValue={type} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="movies" asChild>
            <Link href="/popular?type=movies">Movies</Link>
          </TabsTrigger>
          <TabsTrigger value="tv" asChild>
            <Link href="/popular?type=tv">TV Shows</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={type} className="mt-6">
          <Suspense fallback={<GridSkeleton />}>
            <PopularContent type={type} page={page} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

