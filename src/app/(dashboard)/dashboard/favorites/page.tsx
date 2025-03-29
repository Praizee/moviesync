import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { FavoriteMovies } from "@/components/favorite-movies";

export default async function FavoritesPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/favorites");
  }

  return <FavoriteMovies />;
}

