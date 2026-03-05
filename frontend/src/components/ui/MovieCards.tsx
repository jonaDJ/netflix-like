import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MovieProps } from "../../lib/types";
import MoviePreview from "../layout/MoviePreview";

interface MovieCardProps {
  movie: MovieProps;
  rank?: number;
  top10?: boolean;
  progressPercent?: number;
  onRemove?: (movie: MovieProps) => void;
  onCardClick?: (movie: MovieProps) => void;
  showPreview?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  rank,
  top10,
  progressPercent,
  onRemove,
  onCardClick,
  showPreview = true,
}) => {
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
    if (!showPreview) return;

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
    if (!showPreview) return;

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

  const backdropPath = movie.backdropPath || "/placeholder-horizontal.jpg";

  return (
    <div
      key={movie.id}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("button")) return;
        onCardClick?.(movie);
      }}
      onMouseEnter={(e) => handleMouseEnter(e, movie)}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer flex px-[0.2rem]"
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
                  fontFamily="Arial, Helvetica, sans-serif"
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
            className="object-cover"
          />
          {typeof progressPercent === "number" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-progressTrack">
              <div
                className="h-full bg-brand-progressFill"
                style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
              />
            </div>
          )}
        </div>
      )}

      {showPreview && hoveredMovie === movie && previewPosition && (
        <MoviePreview
          movie={movie}
          position={previewPosition}
          onRemoveContinueWatching={onRemove ? () => onRemove(movie) : undefined}
        />
      )}
    </div>
  );
};

export default MovieCard;
