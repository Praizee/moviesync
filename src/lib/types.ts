export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average?: number;
  genre_ids?: number[];
  media_type?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  published_at?: string;
  official?: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  vote_count: number;
  imdb_id?: string;
  videos?: {
    results: VideoItem[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  overview: string;
  vote_average?: number;
  genre_ids?: number[];
  media_type?: string;
}

export interface TVShowDetails extends TVShow {
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_count: number;
  videos?: {
    results: VideoItem[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
}

