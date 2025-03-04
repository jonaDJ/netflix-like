import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MovieProps } from "../../lib/types";
import MoviePreview from "../layout/MoviePreview";

interface MovieCardProps {
  movie: MovieProps;
  rank?: number;
  top10?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, rank, top10 }) => {
  const [hoveredMovie, setHoveredMovie] = useState<MovieProps | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    movie: MovieProps
  ) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      left: rect.left,
      top: rect.top - 20,
    });

    const timeout = setTimeout(() => {
      setHoveredMovie(movie);
    }, 300);

    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoveredMovie(null);
    setPreviewPosition(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const backdropPath = movie.backdropPath || "/placeholder.jpg";

  return (
    <div
      key={movie.id}
      onMouseEnter={(e) => handleMouseEnter(e, movie)}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer flex px-[0.2rem]"
    >
      {top10 ? (
        <div className="relative w-full aspect-[4/3] ">
          <div className="flex w-full h-full">
            <div className="w-1/2 flex items-center justify-center">
              <svg
                viewBox="0 0 40 50"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                className="flex justify-center items-center"
              >
                <text
                  x="55%"
                  y="65%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="75"
                  fontWeight="bold"
                  fill="black"
                  stroke="gray"
                  strokeWidth="1.5"
                  letterSpacing="-0.85rem"
                >
                  {rank}
                </text>
              </svg>
            </div>
            <div className="w-1/2 relative">
              <Image
                src={movie.posterPath}
                alt={movie.title}
                fill
                sizes="500px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {hoveredMovie === movie && previewPosition && (
        <MoviePreview movie={movie} position={previewPosition} />
      )}
    </div>
  );
};

export default MovieCard;
