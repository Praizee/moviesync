import { MovieGridSkeleton } from "@/components/skeletons/movie-grid-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Popular
      </h1>

      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="mt-6">
          <MovieGridSkeleton count={20} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

