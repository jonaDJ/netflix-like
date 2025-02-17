"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  PlayIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/icons/Icons";
import Button from "@/components/ui/Button";
import { MovieProps } from "@/lib/types";

interface MovieModalProps {
  movie: MovieProps;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setIsInWatchlist(watchlist.some((m: MovieProps) => m.id === movie.id));
  }, [movie.id]);

  const toggleWatchlist = () => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

    if (isInWatchlist) {
      watchlist = watchlist.filter((m: MovieProps) => m.id !== movie.id);
    } else {
      watchlist.push(movie);
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-[7%]">
      <div className="previewModal--wrapper detail-modal bg-custom-gray-900 text-white rounded-md overflow-hidden relative">
        <div className="previewModal--container relative w-full h-[60vh]">
          <Image
            src={movie.poster}
            alt={movie.title}
            layout="fill"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <div className="flex space-x-4 mt-2">
              <Button
                href={`/watch/${movie.slug}`}
                icon={<PlayIcon dark />}
                text="Play"
                bgColor="bg-white"
                textColor="text-black"
                hoverColor="hover:bg-gray-400"
              />
              <button
                onClick={toggleWatchlist}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              >
                {isInWatchlist ? <CheckIcon /> : <PlusIcon />}
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="previewModal--container p-4">
          <p className="text-sm text-gray-400">
            {movie.genre} • {movie.year}
          </p>
          <p className="mt-2">{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
