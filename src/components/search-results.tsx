import Link from "next/link"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { searchMovies } from "@/lib/tmdb"

interface SearchResultsProps {
  query: string
  page: number
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  const results = await searchMovies(query, page)

  if (results.results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground mb-6">We couldn&apos;t find any movies matching &quot;{query}&quot;</p>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {results.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {(results.page < results.total_pages || results.page > 1) && (
        <div className="flex justify-center gap-2 pt-4">
          {results.page > 1 && (
            <Button asChild variant="outline">
              <Link href={`/search?query=${query}&page=${page - 1}`}>Previous</Link>
            </Button>
          )}
          {results.page < results.total_pages && (
            <Button asChild>
              <Link href={`/search?query=${query}&page=${page + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

