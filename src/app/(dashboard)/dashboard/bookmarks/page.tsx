import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { BookmarkedMovies } from "@/components/bookmarked-movies";

export default async function BookmarksPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/bookmarks");
  }

  return <BookmarkedMovies />;
}

