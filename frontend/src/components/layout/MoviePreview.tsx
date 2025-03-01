"use client";

import { MovieProps } from "../../lib/types";
import useWatchlist from "../hooks/useWatchlist";
import Image from "next/image";
import { PlayIcon, CheckIcon, DownArrowIcon, PlusIcon } from "../icons/Icons";
import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useDynamicLayout } from "../contexts/DynamicLayoutContext";
import { getGenreNames } from "../../utils/genreUtils";
import { useEffect, useState } from "react";
import Link from "next/link";

interface MoviePreviewProps {
  movie: MovieProps;
  position: { left: number; top: number };
}

const MoviePreview: React.FC<MoviePreviewProps> = ({ movie, position }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(String(movie.id));
  const { itemWidth } = useDynamicLayout();
  const [calculatedLeft, setCalculatedLeft] = useState<number>(0);
  const [calculatedTop, setCalculatedTop] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const genreNames = getGenreNames(movie.genres.slice(0, 2) || [], "movie");

  const handleOpenMovie = () => {
    const jbv = movie.id;
    router.push(`${pathname}/?jbv=${jbv}&type=${movie.type}`, {
      scroll: false,
    });
  };

  const handlePlayClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/watch/${movie.id}?&type=${movie.type}`);
  };

  const handleToggleWatchlist = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleWatchlist(movie);
  };

  useEffect(() => {
    const midpoint = position.left + itemWidth / 2;
    let newLeft = Math.max(
      window.innerWidth * 0.04,
      midpoint - (itemWidth * 1.5) / 2
    );

    const rightEdge = newLeft + itemWidth * 1.5;
    if (rightEdge > window.innerWidth) {
      newLeft -= rightEdge - window.innerWidth * 0.94;
    }

    setCalculatedLeft(newLeft);

    const midpointTop = position.top - 10;
    let newTop = Math.max(window.innerHeight * 0.07, midpointTop - 10);

    const bottomEdge = newTop + 300;
    if (bottomEdge > window.innerHeight) {
      console.log("b", newTop, bottomEdge, window.innerHeight);
      newTop -= bottomEdge - window.innerHeight * 0.9;
    }

    setCalculatedTop(newTop);
  }, [position, itemWidth]);

  return (
    <div
      className="absolute z-20 bg-black text-white rounded-md zoomInOut"
      style={{
        left: `${calculatedLeft}px`,
        top: `${calculatedTop}px`,
        width: `${itemWidth * 1.5}px`,
        position: "fixed",
        zIndex: 40,
      }}
      onClick={handleOpenMovie}
    >
      <div className="relative w-full h-[12rem] overflow-hidden cursor-default">
        <Link
          href={`/watch/${movie.id}?&type=${movie.type}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute inset-0">
            <Image
              src={movie.backdropPath}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Link>
      </div>
      <div className="p-3 pt-1 cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2 m-2 ml-0">
            <Button
              onClick={(event: React.MouseEvent) => handlePlayClick(event)}
              icon={<PlayIcon dark />}
              className="bg-white"
            />
            <Button
              onClick={(event: React.MouseEvent) =>
                handleToggleWatchlist(event)
              }
              icon={isInWatchlist ? <CheckIcon /> : <PlusIcon />}
              className="bg-gray-800 p-1.5"
            />
          </div>
          <div>
            <Button
              onClick={handleOpenMovie}
              icon={<DownArrowIcon />}
              className="bg-gray-800"
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
        <div className="mt-1 flex items-center text-sm text-gray-400">
          {genreNames.map((genre, index) => (
            <span key={genre} className="flex items-center">
              {index !== 0 && <span className="mx-1">&bull;</span>}
              <span>{genre}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePreview;
