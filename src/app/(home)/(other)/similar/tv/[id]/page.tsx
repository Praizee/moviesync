import { getSimilarTVShows, getTVShowDetails } from "@/lib/tmdb";
import { TVShowCard } from "@/components/tv-show-card";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TVShow } from "@/lib/types";

interface SimilarTVShowsPageProps {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function SimilarTVShowsPage({
  params,
  searchParams,
}: SimilarTVShowsPageProps) {
  const page = Number(searchParams.page) || 1;
  const showId = params.id;

  try {
    // Get the original show details for the title
    const showDetails = await getTVShowDetails(showId);
    const similarShows = await getSimilarTVShows(showId, page);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tv/${showId}`} className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to {showDetails.name}
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">
          TV Shows Similar to &quot;{showDetails.name}&quot;
        </h1>

        {similarShows.results && similarShows.results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {similarShows.results.map((show: TVShow) => (
                <TVShowCard key={show.id} show={show} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={similarShows.total_pages}
              baseUrl={`/similar/tv/${showId}`}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No similar TV shows found for &quot;{showDetails.name}&quot;.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/tv/${showId}`}>Back to TV Show</Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in SimilarTVShowsPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Similar TV Shows</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Unable to load similar TV shows at this time.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
}

