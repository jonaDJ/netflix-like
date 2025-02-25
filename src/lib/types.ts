export interface MovieProps {
  id: number;
  title: string;
  slug: string;
  poster: string;
  genres: number[];
  description: string;
  videoUrl: string | null;
  releaseDate: string | null;
  director: string | null;
  backdropPath: string;
}
