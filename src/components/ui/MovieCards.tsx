import React, { useState } from "react";
import Image from "next/image";
import { MovieProps } from "@/lib/types";
import MoviePreview from "../layout/MoviePreview";

interface MovieCardProps {
  movie: MovieProps;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [hoveredMovie, setHoveredMovie] = useState<MovieProps | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    movie: MovieProps
  ) => {
    setHoveredMovie(movie);

    // Calculate position ONLY on mouse enter:
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      left: rect.left,
      top: rect.top - 20,
    });
  };

  const handleMouseLeave = () => {
    setHoveredMovie(null);
    setPreviewPosition(null);
  };

  const backdropPath = movie.backdropPath || "/placeholder.jpg";

  return (
    <div
      key={movie.id}
      onMouseEnter={(e) => handleMouseEnter(e, movie)}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer flex px-[0.2rem]"
    >
      <div className="relative w-full aspect-[4/2.5] ">
        <Image
          src={backdropPath}
          alt={movie.title}
          fill
          sizes="500px"
          priority
          className="object-cover"
        />
      </div>
      {hoveredMovie === movie && previewPosition && (
        <MoviePreview movie={movie} position={previewPosition} />
      )}
    </div>
  );
};

export default MovieCard;
