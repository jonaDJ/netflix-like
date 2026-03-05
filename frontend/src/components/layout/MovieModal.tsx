"use client";

import { useEffect, useState } from "react";
import { MovieProps } from "../../lib/types";
import useWatchlist from "../hooks/useWatchlist";
import Image from "next/image";
import { PlayIcon, PlusIcon, CheckIcon, CloseIcon } from "../icons/Icons";
import Link from "next/link";
import { getGenreNames } from "../../utils/genreUtils";
import { formatRuntime } from "src/utils/timeUtils";
import { useProfile } from "../contexts/ProfileContext";
import { loadContinueWatching, removeWatchProgress } from "../../utils/profileStorage";

interface MovieModalProps {
  movie: MovieProps;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(
    String(movie.id),
    movie.type
  );
  const { activeProfile } = useProfile();
  const [isInContinueWatching, setIsInContinueWatching] = useState(false);
  const genreType = movie.type === "tv" || movie.type === "tvShow" ? "tv" : "movie";
  const genreNames = getGenreNames(movie.genres.slice(0, 2) || [], genreType);

  useEffect(() => {
    if (!activeProfile) {
      setIsInContinueWatching(false);
      return;
    }

    const progressItems = loadContinueWatching(activeProfile.id);
    setIsInContinueWatching(
      progressItems.some((item) => item.id === String(movie.id))
    );
  }, [activeProfile, movie.id, movie.type]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleRemoveContinueWatching = () => {
    if (!activeProfile) return;
    removeWatchProgress(activeProfile.id, {
      id: String(movie.id),
    });
    setIsInContinueWatching(false);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain bg-brand-overlay px-[7%] py-6 md:py-10 zoomInOut"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-md bg-brand-surface text-brand-text"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3 top-3 z-20 rounded-full bg-brand-overlaySoft p-2 hover:bg-brand-overlaySubtle"
        >
          <CloseIcon className="h-5 w-5 text-brand-text" />
        </button>
        <div className="relative h-[50vh] min-h-[240px] w-full flex-shrink-0">
          <Image
            src={movie.backdropPath}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-overlaySubtle to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-overlaySubtle to-transparent"></div>

          <div className="absolute px-[5%] bottom-5">
            <h2 className="text-h1 font-bold">{movie.title}</h2>
            <div className="mt-4 flex items-center space-x-2">
              <Link
                href={`/watch/${movie.id}?&type=${movie.type}`}
                className="flex items-center gap-2 bg-brand-text text-brand-inverse px-4 py-2 rounded hover:bg-brand-textSecondary transition-colors"
              >
                <PlayIcon dark />
                Play
              </Link>
              <button
                onClick={() => toggleWatchlist(movie)}
                className="p-2 rounded-full bg-brand-elevated hover:bg-brand-overlaySoft transition-colors"
                aria-label={
                  isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
                }
              >
                {isInWatchlist ? <CheckIcon /> : <PlusIcon />}
              </button>
              {isInContinueWatching && (
                <button
                  onClick={handleRemoveContinueWatching}
                  className="p-2 rounded-full bg-brand-elevated hover:bg-brand-overlaySoft transition-colors"
                  aria-label="Remove from continue watching"
                >
                  <CloseIcon className="h-5 w-5 text-brand-text" />
                </button>
              )}
            </div>
          </div>

        </div>

        <div className="px-[5%] py-[3%]">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="md:w-2/3">
              <p className="mt-2 text-sm text-brand-textMuted">
                {movie.releaseDate && (
                  <span className="px-1">
                    {new Date(movie.releaseDate).getFullYear()}
                  </span>
                )}
                {movie.runtime && (
                  <span className="px-1">{formatRuntime(movie.runtime)}</span>
                )}
                {movie.rating && (
                  <span className="px-1">{movie.rating.toFixed(1)}/10</span>
                )}
              </p>
              <p className="mt-4 text-sm">{movie.overview}</p>

              <div className="mt-4 text-sm text-brand-textMuted">
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

            <div className="md:w-1/3 mt-4 md:mt-0">
              <div className="text-sm text-brand-textMuted">
                {movie.cast.length > 0 && (
                  <div>
                    <span className="font-semibold">Cast:</span>{" "}
                    <span className="text-brand-text">
                      {movie.cast.map((c) => c.name).join(", ")}
                    </span>
                  </div>
                )}
                {movie.genres.length > 0 && (
                  <div className="mt-2">
                    <span className="font-semibold">Genres:</span>{" "}
                    <span className="text-brand-text">{genreNames.join(", ")}</span>
                  </div>
                )}
                {movie.countries.length > 0 && (
                  <div className="mt-2">
                    <span className="font-semibold">Countries:</span>{" "}
                    <span className="text-brand-text">
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
