import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get movie favorites
    const { data: movieFavorites, error: movieError } = await supabase
      .from("favorites")
      .select("*, movie_id(*)")
      .eq("user_id", session.user.id)
      .is("show_id", null)

    if (movieError) throw movieError

    // Get TV show favorites
    const { data: showFavorites, error: showError } = await supabase
      .from("favorites")
      .select("*, show_id(*)")
      .eq("user_id", session.user.id)
      .is("movie_id", null)

    if (showError) throw showError

    // Format the response
    const formattedFavorites = [
      ...(movieFavorites || []).map((favorite) => ({
        id: favorite.id,
        user_id: favorite.user_id,
        movie_id: favorite.movie_id?.id,
        movie_details: favorite.movie_id,
        created_at: favorite.created_at,
      })),
      ...(showFavorites || []).map((favorite) => ({
        id: favorite.id,
        user_id: favorite.user_id,
        show_id: favorite.show_id?.id,
        show_details: favorite.show_id,
        created_at: favorite.created_at,
      })),
    ]

    return NextResponse.json({ favorites: formattedFavorites })
  } catch (error: any) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { movieId, movieData, showId, showData } = body

    console.log("Favorite request:", { movieId, showId })

    if (!movieId && !showId) {
      return NextResponse.json({ error: "Movie ID or Show ID is required" }, { status: 400 })
    }

    if (movieId) {
      // First, check if the movie exists in the movies table
      const { data: existingMovie } = await supabase.from("movies").select("id").eq("id", movieId).single()

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
        })

        if (insertError) throw insertError
      }

      // Check if the favorite already exists
      const { data: existingFavorite } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId)
        .single()

      if (existingFavorite) {
        return NextResponse.json({ message: "Movie already in favorites" })
      }

      // Add the favorite
      const { error } = await supabase.from("favorites").insert({
        user_id: session.user.id,
        movie_id: movieId,
      })

      if (error) throw error

      return NextResponse.json({ message: "Movie added to favorites successfully" })
    } else if (showId) {
      // First, check if the show exists in the shows table
      const { data: existingShow } = await supabase.from("shows").select("id").eq("id", showId).single()

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
        })

        if (insertError) throw insertError
      }

      // Check if the favorite already exists
      const { data: existingFavorite } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("show_id", showId)
        .single()

      if (existingFavorite) {
        return NextResponse.json({ message: "Show already in favorites" })
      }

      // Add the favorite
      const { error } = await supabase.from("favorites").insert({
        user_id: session.user.id,
        show_id: showId,
      })

      if (error) throw error

      return NextResponse.json({ message: "Show added to favorites successfully" })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error: any) {
    console.error("Error creating favorite:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movieId")
    const showId = searchParams.get("showId")

    console.log("Delete favorite request:", { movieId, showId })

    if (!movieId && !showId) {
      return NextResponse.json({ error: "Movie ID or Show ID is required" }, { status: 400 })
    }

    if (movieId) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", session.user.id).eq("movie_id", movieId)

      if (error) throw error

      return NextResponse.json({ message: "Favorite removed successfully" })
    } else if (showId) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", session.user.id).eq("show_id", showId)

      if (error) throw error

      return NextResponse.json({ message: "Favorite removed successfully" })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error: any) {
    console.error("Error deleting favorite:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

