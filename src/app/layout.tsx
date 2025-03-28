import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "MovieSync";
const APP_DESCRIPTION =
  "Discover, bookmark, and manage your favorite movies. Sync your watchlist across all your devices.";
const APP_URL = "https://moviesync-tan.vercel.app/";
const AUTHOR_NAME = "Stephen Adeniji";
const AUTHOR_URL = "https://stephen-adeniji.is-a.dev/";

export const metadata: Metadata = {
  title: {
    default: "MovieSync 🎬 - Bookmark Your Favorite Movies",
    template: `%s | ${APP_NAME}`,
  },
  description: `${APP_DESCRIPTION}`,
  keywords: [
    "moviesync",
    `${APP_NAME}`,
    "movie sync",
    "movie bookmark",
    "movie tracker",
    "movie watchlist",
    "movie database",
    "movie discovery",
    "movie management",
    "movie recommendations",
    "movie ratings",
    "movie reviews",
    "movie collections",
    "movie organization",
    "movie search",
    "movie library",
    "movie catalog",
    "movie database app",
    "movies",
    "bookmarks",
    "watchlist",
    "TMDB",
    "favorites",
    "movie tracker",
  ],
  authors: [{ name: `${AUTHOR_NAME}`, url: `${AUTHOR_URL}` }],
  creator: `${AUTHOR_NAME}`,
  publisher: `${AUTHOR_NAME}`,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: `${APP_NAME} - Bookmark Your Favorite Movies`,
    description: `${APP_DESCRIPTION}`,
    url: `${APP_URL}`,
    siteName: `${APP_NAME}`,
    images: [
      {
        url: "/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Bookmark Your Favorite Movies`,
    description: `${APP_DESCRIPTION}`,
    images: ["/twitter-image.jpg"], // Replace with your actual Twitter image
    creator: "@steve_ade1407",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // If you have one
  verification: {
    google: "your-google-verification-code", // If using Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

