import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { BookmarkedMovies } from "@/components/bookmarked-movies";

export default async function BookmarksPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/bookmarks");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl  font-bold mb-6">
        Your Bookmarks
      </h1>
      <BookmarkedMovies />
    </div>
  );
}

