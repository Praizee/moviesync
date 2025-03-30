"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkedMovies } from "@/components/bookmarked-movies";
import { FavoriteMovies } from "@/components/favorite-movies";

export function DashboardTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const isBookmarksTab =
    pathname === "/dashboard" || pathname === "/dashboard/bookmarks";
  const isFavoritesTab = pathname === "/dashboard/favorites";

  const activeTab = isBookmarksTab
    ? "bookmarks"
    : isFavoritesTab
    ? "favorites"
    : "bookmarks";

  // const handleTabChange = (value: string) => {
  //   if (value === "bookmarks") {
  //     router.push("/bookmarks");
  //   } else if (value === "favorites") {
  //     router.push("/favorites");
  //   }
  // };

  return (
    <Tabs
      defaultValue={activeTab}
      // onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>
      <TabsContent value="bookmarks">
        <BookmarkedMovies />
      </TabsContent>
      <TabsContent value="favorites">
        <FavoriteMovies />
      </TabsContent>
    </Tabs>
  );
}

