# MovieSync🎬

## Overview
MovieSync is a web application that allows users to browse movies, bookmark them for later, mark them as favorites, and manage their profiles. Authentication is required for bookmarking, favoriting, and accessing detailed movie information. The app ensures persistence of user data and supports cross-device syncing.

## Tech Stack
- **Frontend Framework:** Next.js
- **Language:** TypeScript
- **API:** TMDB API (The Movie Database) for movie data
- **Authentication:** Supabase

## Features
### Movie Browsing (Public)
- All users (authenticated or not) can view a list of movies.
- Only authenticated users can access detailed movie information (e.g., description, trailer).
- Users can search for movies.

### User Authentication
- Implemented via Supabase.
- Once authenticated, users can:
  - Bookmark movies to watch later.
  - Mark movies as favorites.
  - Remove movies from bookmarks and favorites.
  - Access and edit their profile details.
  - Logout securely.

### Dashboard (Authenticated Users Only)
- Displays a list of bookmarked and favorite movies.
- Dynamically updates when movies are added or removed.

### Cross-Device Syncing
- User bookmarks and favorites persist and sync across different devices.

### Movie Details (Authenticated Users Only)
- View in-depth movie details such as descriptions and trailers (if available).

### Profile & Settings
- Users can view and edit their profile (e.g., update their name).
- Profile changes persist across sessions.

### General UI/UX Considerations
- Intuitive, responsive, and clean user interface.
- Proper error handling for unauthenticated access attempts.

## Setup & Installation
### Prerequisites
- Node.js (>=16)
- pnpm
- TMDB API Key
- Supabase Project (for authentication & data persistence)

### Installation Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/moviesync.git
   cd moviesync
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   NEXT_PUBLIC_AUTH_PROVIDER=supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the development server:**
   ```sh
   pnpm dev
   ```
5. Open `http://localhost:3000` in your browser.

## Future Enhancements
- Implement dark mode.
- Add user-generated movie reviews.
- Implement social sharing of movie lists.
- Optimize performance with server-side rendering (SSR) and caching.

## License
This project is licensed under the MIT License.

## Contributions
Contributions are welcome! Feel free to open an issue or submit a pull request.

## Contact
For questions or support, reach out via [adeolaastephen@gmail.com](mailto:adeolaastephen@gmail.com).
