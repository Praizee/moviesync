import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMovies, getTVShows } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { TVShowCard } from "@/components/tv-show-card";
import { Pagination } from "@/components/pagination";

interface TopRatedPageProps {
  searchParams: {
    page?: string;
    type?: string;
  };
}

export default async function TopRatedPage({
  searchParams,
}: TopRatedPageProps) {
  const page = Number(searchParams.page) || 1;
  const type = searchParams.type || "movies";

  const isMovies = type === "movies";

  try {
    const data = isMovies
      ? await getMovies("top_rated", page)
      : await getTVShows("top_rated", page);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Top Rated</h1>

        <Tabs defaultValue={type} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="movies" asChild>
              <a href="/top-rated?type=movies">Movies</a>
            </TabsTrigger>
            <TabsTrigger value="tv" asChild>
              <a href="/top-rated?type=tv">TV Shows</a>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={type} className="mt-6">
            {data.results && data.results.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {isMovies
                    ? data.results.map((movie: any) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))
                    : data.results.map((show: any) => (
                        <TVShowCard key={show.id} show={show} />
                      ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={data.total_pages}
                  baseUrl={`/top-rated?type=${type}`}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No top rated content available at the moment. Please try again
                  later.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error in TopRatedPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Top Rated</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Unable to load top rated content at this time. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }
}

