import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12 max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6" />
              <span className="text-xl font-bold">MovieSync</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Browse, bookmark, and favorite movies across all your devices.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/trending"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/popular"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Popular
                </Link>
              </li>
              <li>
                <Link
                  href="/top-rated"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Top Rated
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/bookmarks"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Bookmarks
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Library
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} MovieSync. All rights reserved.
          </p>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground text-center md:text-right">
              This product uses the{" "}
              <Link
                href="https://developer.themoviedb.org/reference/intro/getting-started"
                target="_blank"
                className="hover:text-primary font-medium duration-150 transition-colors hover:underline"
              >
                TMDB API
              </Link>{" "}
              but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

