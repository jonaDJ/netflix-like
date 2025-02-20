export interface MovieProps {
  id: number;
  title: string;
  slug: string;
  poster: string;
  genre: string[];
  description: string;
  videoUrl: string | null;
  releaseDate: string | null;
  director: string | null;
}
