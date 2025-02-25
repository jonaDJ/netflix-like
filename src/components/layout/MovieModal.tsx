"use client";

import { MovieProps } from "@/lib/types";
import useWatchlist from "@/components/hooks/useWatchlist";
import Image from "next/image";
import {
  PlayIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
  // Optionally import a TrailerIcon if you have one
} from "@/components/icons/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MovieModalProps {
  movie: MovieProps;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(String(movie.id));
  const router = useRouter();

  const closeModal = () => {
    // Remove query parameters by navigating to the home page.
    router.push("/", { scroll: false });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-[7%] zoomInOut">
      <div className="bg-black text-white rounded-md overflow-hidden relative w-full max-w-3xl">
        <div className="relative w-full h-[50vh]">
          <Image
            src={movie.backdropPath}
            alt={movie.title}
            fill
            className="object-cover"
          />
          {/* Gradient overlays for visual effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="absolute px-[5%] bottom-5">
            <div className="mt-4 flex items-center space-x-2">
              <Link
                href={`/watch/${movie.slug}`}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                <PlayIcon dark />
                Play
              </Link>
              <button
                onClick={() => toggleWatchlist(movie)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {isInWatchlist ? <CheckIcon /> : <PlusIcon />}
              </button>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-[5%] py-[3%]">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Left Column: Main details */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              <p className="mt-2 text-sm text-gray-400">
                <span className="px-1">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "Unknown"}
                </span>
                <span className="px-1">
                  {movie.runtime ? `${movie.runtime} min` : ""}
                </span>
                <span className="px-1">
                  {movie.rating ? `${movie.rating.toFixed(1)} / 10` : ""}
                </span>
              </p>
              <p className="mt-4 text-sm">{movie.overview}</p>
              <div className="mt-4 text-sm text-gray-400">
                {movie.languages.length > 0 && (
                  <div>
                    <span className="font-semibold">Languages:</span>{" "}
                    {movie.languages.join(", ")}
                  </div>
                )}

                {movie.director && (
                  <div className="mt-1">
                    <span className="font-semibold">Directed by:</span>{" "}
                    {movie.director}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Additional details */}
            <div className="md:w-1/3 mt-4 md:mt-0">
              <div className="text-sm text-gray-400">
                <div>
                  <span className="font-semibold">Cast: </span>
                  <span className="text-white">
                    {movie.cast.length > 0
                      ? movie.cast.map((c) => c.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Genres: </span>
                  <span className="text-white">
                    {movie.genres.length > 0 ? movie.genres.join(", ") : "N/A"}
                  </span>
                </div>
                {movie.countries.length > 0 && (
                  <div className="mt-2">
                    <span className="font-semibold ">Countries: </span>
                    <span className="text-white">
                      {movie.countries.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
