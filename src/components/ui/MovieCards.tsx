import React, { useState } from "react";
import Image from "next/image";
import { MovieProps } from "@/lib/types";
import MoviePreview from "../layout/MoviePreview";

interface MovieCardProps {
  movie: MovieProps;
  rank: number;
  top10?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, rank, top10 }) => {
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
        {top10 ? (
          <>
            <div className="flex w-full h-full">
              {/* Parent flex container for 50/50 split */}
              <div className="w-1/2 flex items-center justify-center">
                <svg
                  viewBox="0 0 40 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text
                    x="60%"
                    y="60%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="60"
                    fontWeight="bold"
                    fill="black"
                    stroke="grey"
                    strokeWidth="2"
                    letterSpacing="-0.15em"
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
          </>
        ) : (
          <Image
            src={backdropPath}
            alt={movie.title}
            fill
            sizes="500px"
            priority
            className="object-cover"
          />
        )}
      </div>
      {hoveredMovie === movie && previewPosition && (
        <MoviePreview movie={movie} position={previewPosition} />
      )}
    </div>
  );
};

export default MovieCard;
