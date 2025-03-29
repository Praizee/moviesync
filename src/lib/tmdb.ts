import type { MovieDetails, TVShowDetails } from "@/lib/types";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchWithErrorHandling(url: string, options = {}) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      // Check if it's a rate limit error
      if (res.status === 429) {
        console.error("TMDB API rate limit exceeded");
        return { results: [], page: 1, total_pages: 1, total_results: 0 };
      }

      // For other errors, don't try to parse the response as JSON
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    // Return a fallback empty response
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }
}

export async function getMovies(type: string, page = 1) {
  const url = `${TMDB_BASE_URL}/movie/${type}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  return await fetchWithErrorHandling(url, { next: { revalidate: 3600 } });
}

export async function getTVShows(type: string, page = 1) {
  const url = `${TMDB_BASE_URL}/tv/${type}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  return await fetchWithErrorHandling(url, { next: { revalidate: 3600 } });
}

export async function getTrending(
  mediaType: "movie" | "tv" | "all",
  timeWindow: "day" | "week" = "week",
  page = 1
) {
  const url = `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`;
  return await fetchWithErrorHandling(url, { next: { revalidate: 3600 } });
}

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits,reviews`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      if (res.status === 429) {
        console.error("TMDB API rate limit exceeded");
        throw new Error("Rate limit exceeded, please try again later");
      }

      throw new Error(`Failed to fetch movie details: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function getTVShowDetails(id: string): Promise<TVShowDetails> {
  const url = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits,reviews`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      if (res.status === 429) {
        console.error("TMDB API rate limit exceeded");
        throw new Error("Rate limit exceeded, please try again later");
      }

      throw new Error(`Failed to fetch TV show details: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    throw error;
  }
}

export async function searchMovies(query: string, page = 1) {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=${page}`;
  return await fetchWithErrorHandling(url, { next: { revalidate: 3600 } });
}

export async function searchTVShows(query: string, page = 1) {
  const url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=${page}`;
  return await fetchWithErrorHandling(url, { next: { revalidate: 3600 } });
}

