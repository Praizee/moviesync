import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get movie bookmarks
    const { data: movieBookmarks, error: movieError } = await supabase
      .from("bookmarks")
      .select("*, movie_id(*)")
      .eq("user_id", session.user.id)
      .is("show_id", null);

    if (movieError) throw movieError;

    // Get TV show bookmarks
    const { data: showBookmarks, error: showError } = await supabase
      .from("bookmarks")
      .select("*, show_id(*)")
      .eq("user_id", session.user.id)
      .is("movie_id", null);

    if (showError) throw showError;

    // Format the response
    const formattedBookmarks = [
      ...(movieBookmarks || []).map((bookmark) => ({
        id: bookmark.id,
        user_id: bookmark.user_id,
        movie_id: bookmark.movie_id?.id,
        movie_details: bookmark.movie_id,
        created_at: bookmark.created_at,
      })),
      ...(showBookmarks || []).map((bookmark) => ({
        id: bookmark.id,
        user_id: bookmark.user_id,
        show_id: bookmark.show_id?.id,
        show_details: bookmark.show_id,
        created_at: bookmark.created_at,
      })),
    ];

    return NextResponse.json({ bookmarks: formattedBookmarks });
  } catch (error: unknown) {
    console.error("Error fetching bookmarks:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { movieId, movieData, showId, showData } = body;

    console.log("Bookmark request:", { movieId, showId });

    if (!movieId && !showId) {
      return NextResponse.json(
        { error: "Movie ID or Show ID is required" },
        { status: 400 }
      );
    }

    if (movieId) {
      // First, check if the movie exists in the movies table
      const { data: existingMovie } = await supabase
        .from("movies")
        .select("id")
        .eq("id", movieId)
        .single();

      // If the movie doesn't exist, insert it
      if (!existingMovie && movieData) {
        const { error: insertError } = await supabase.from("movies").insert({
          id: movieId,
          title: movieData.title,
          poster_path: movieData.poster_path,
          release_date: movieData.release_date,
          overview: movieData.overview,
          vote_average: movieData.vote_average,
          media_type: "movie",
        });

        if (insertError) throw insertError;
      }

      // Check if the bookmark already exists
      const { data: existingBookmark } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId)
        .single();

      if (existingBookmark) {
        return NextResponse.json({ message: "Movie already bookmarked" });
      }

      // Add the bookmark
      const { error } = await supabase.from("bookmarks").insert({
        user_id: session.user.id,
        movie_id: movieId,
      });

      if (error) throw error;

      return NextResponse.json({ message: "Movie bookmarked successfully" });
    } else if (showId) {
      // First, check if the show exists in the shows table
      const { data: existingShow } = await supabase
        .from("shows")
        .select("id")
        .eq("id", showId)
        .single();

      // If the show doesn't exist, insert it
      if (!existingShow && showData) {
        const { error: insertError } = await supabase.from("shows").insert({
          id: showId,
          name: showData.name,
          poster_path: showData.poster_path,
          first_air_date: showData.first_air_date,
          overview: showData.overview,
          vote_average: showData.vote_average,
          media_type: "tv",
        });

        if (insertError) throw insertError;
      }

      // Check if the bookmark already exists
      const { data: existingBookmark } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("show_id", showId)
        .single();

      if (existingBookmark) {
        return NextResponse.json({ message: "Show already bookmarked" });
      }

      // Add the bookmark
      const { error } = await supabase.from("bookmarks").insert({
        user_id: session.user.id,
        show_id: showId,
      });

      if (error) throw error;

      return NextResponse.json({ message: "Show bookmarked successfully" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Error creating bookmark:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");
    const showId = searchParams.get("showId");

    console.log("Delete bookmark request:", { movieId, showId });

    if (!movieId && !showId) {
      return NextResponse.json(
        { error: "Movie ID or Show ID is required" },
        { status: 400 }
      );
    }

    if (movieId) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);

      if (error) throw error;

      return NextResponse.json({ message: "Bookmark removed successfully" });
    } else if (showId) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", session.user.id)
        .eq("show_id", showId);

      if (error) throw error;

      return NextResponse.json({ message: "Bookmark removed successfully" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Error deleting bookmark:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

