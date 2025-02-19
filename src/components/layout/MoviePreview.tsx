"use client";

import { MovieProps } from "@/lib/types";
import useWatchlist from "@/components/hooks/useWatchlist";
import Image from "next/image";
import { PlayIcon, CheckIcon, DownArrowIcon, PlusIcon } from "../icons/Icons";
import { useRouter } from "next/navigation";

interface MoviePreviewProps {
  movie: MovieProps;
  position: { left: number; top: number };
}

const MoviePreview: React.FC<MoviePreviewProps> = ({ movie, position }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(String(movie.id));

  const router = useRouter();

  const openModal = () => {
    router.push(`/?movie-info=${movie.id}`, { scroll: false });
  };

  return (
    <div
      className="absolute z-20 bg-black text-white p-2"
      style={{
        left: position.left,
        top: position.top,
        width: "280px",
        position: "fixed",
        zIndex: 40,
      }}
    >
      <div className="relative w-full h-40 rounded-t-md overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2">
            <button className="p-2 rounded-full bg-white hover:bg-gray-700">
              <PlayIcon dark />
            </button>
            <button
              onClick={() => toggleWatchlist(movie)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              {isInWatchlist ? <CheckIcon /> : <PlusIcon />}
            </button>
          </div>
          <div>
            <button
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              onClick={openModal}
            >
              <DownArrowIcon />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
      </div>
    </div>
  );
};

export default MoviePreview;
