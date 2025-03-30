"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Search, User, Bookmark, Heart, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSupabase } from "@/components/supabase-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { LogoutConfirmation } from "./logout-confirmation";

export function Navbar() {
  const pathname = usePathname();
  const { supabase, session } = useSupabase();
  const [profile, setProfile] = useState<{
    name?: string;
    avatar_url?: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", session.user.id)
        .single();

      setProfile(data);
    }

    loadProfile();
  }, [session, supabase]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-full border-b bg-background sticky top-0 z-40">
      <header className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mx-auto flex h-16 items-center justify-between">
          {/* removed 'container' from above... (don't like the 'jump') */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Film className="size-6" />
              <span className="text-xl font-bold">MovieSync</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href="/trending"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/trending")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Trending
              </Link>
              <Link
                href="/popular"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/popular")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Popular
              </Link>
              <Link
                href="/top-rated"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/top-rated")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Top Rated
              </Link>
              <Link
                href="/search"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/search") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Search
              </Link>
              {session && (
                <>
                  <Link
                    href="/bookmarks"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      // pathname.startsWith("/bookmarks")
                      isActive("/bookmarks")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Bookmarks
                  </Link>

                  <Link
                    href="/favorites"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/favorites")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Favorites
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/search" className="md:hidden">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>

            <div className="min-[350px]:block hidden">
              <ThemeToggle />
            </div>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt={profile?.name || "User"}
                      />
                      <AvatarFallback>
                        {profile?.name?.charAt(0) ||
                          session.user.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {profile?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/library"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Library className="mr-2 h-4 w-4" />
                      <span>Library</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/bookmarks"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Bookmarks</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/favorites"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutConfirmation />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

