import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { SearchForm } from "@/components/search-form";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Search Movies
      </h1>
      <SearchForm initialQuery="" />

      <div className="mt-8">
        {/* <h2 className="text-xl font-semibold mb-4">Loading results...</h2> */}
        <MovieGridSkeleton count={20} />
      </div>
    </div>
  );
}

