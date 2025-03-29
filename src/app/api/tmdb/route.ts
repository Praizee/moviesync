import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Missing endpoint parameter" },
      { status: 400 }
    );
  }

  // Check if the endpoint requires authentication
  const requiresAuth =
    endpoint.includes("account") || endpoint.includes("list");

  if (requiresAuth) {
    const supabase = await createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
  }

  // Build the TMDB API URL
  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      params.append(key, value);
    }
  });

  params.append("api_key", TMDB_API_KEY || "");

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?${params.toString()}`
    );

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded, please try again later" },
          { status: 429 }
        );
      }

      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch data from TMDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from TMDB" },
      { status: 500 }
    );
  }
}

