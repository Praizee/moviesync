import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";
import { SearchForm } from "@/components/search-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const query = searchParams.query || "";
  const page = Number(searchParams.page) || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Search Movies
      </h1>
      <SearchForm initialQuery={query} />

      {query ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Results for &quot;{query}&quot;
          </h2>
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults query={query} page={page} />
          </Suspense>
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p>Enter a movie title to search</p>
        </div>
      )}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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

