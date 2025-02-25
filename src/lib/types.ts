export interface CastMember {
  name: string;
}

export interface MovieProps {
  id: number;
  title: string;
  slug: string;
  posterPath: string;
  backdropPath: string;
  genres: number[];
  description: string;
  videoUrl: string | null;
  releaseDate: string | null;
  rating: number;
  runtime?: number;
  director: string | null;
  cast: CastMember[];
  trailerUrl: string | null;
  languages: string[];
  countries: string[];
  type: string;
  overview: string;
  numberOfSeasons?: number; // For TV shows
  numberOfEpisodes?: number; // For TV shows
}
