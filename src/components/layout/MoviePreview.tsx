"use client";

import { MovieProps } from "@/lib/types";
import useWatchlist from "@/components/hooks/useWatchlist";
import Image from "next/image";
import { PlayIcon, CheckIcon, DownArrowIcon, PlusIcon } from "../icons/Icons";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useDynamicLayout } from "../contexts/DynamicLayoutContext";
import { getGenreNames } from "@/utils/genreUtils";
import { useEffect, useState } from "react";

interface MoviePreviewProps {
  movie: MovieProps;
  position: { left: number; top: number };
}

const MoviePreview: React.FC<MoviePreviewProps> = ({ movie, position }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(String(movie.id));
  const { itemWidth } = useDynamicLayout();
  const [calculatedLeft, setCalculatedLeft] = useState<number>(0);
  const [calculatedTop, setCalculatedTop] = useState<number>(0); // New state for vertical positioning
  const router = useRouter();
  const genreNames = getGenreNames(movie.genres.slice(0, 2) || [], "movie");

  const handleOpenMovie = () => {
    const jbv = movie.id;
    router.push(`/?jbv=${jbv}&type=${movie.type}`, { scroll: true });
  };

  useEffect(() => {
    const midpoint = position.left + itemWidth / 2;
    let newLeft = Math.max(
      window.innerWidth * 0.04,
      midpoint - (itemWidth * 1.5) / 2
    );

    const rightEdge = newLeft + itemWidth * 1.5;
    if (rightEdge > window.innerWidth) {
      newLeft -= rightEdge - window.innerWidth * 0.96;
    }

    setCalculatedLeft(newLeft);

    const midpointTop = position.top - 10;
    let newTop = Math.max(window.innerHeight * 0.07, midpointTop - 10);

    const bottomEdge = newTop + 280;
    if (bottomEdge > window.innerHeight) {
      newTop -= newTop + 240 - window.innerHeight * 0.9;
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
    >
      <div className="relative w-full h-[12rem] overflow-hidden">
        <Image
          src={movie.backdropPath}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-3 pt-1">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2 m-2 ml-0">
            <Button
              onClick={() =>
                router.push(`/watch/${movie.id}?&type=${movie.type}`)
              }
              icon={<PlayIcon dark />}
              className="bg-white"
            />
            <Button
              onClick={() => toggleWatchlist(movie)}
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
