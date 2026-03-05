import { MovieProps } from "../../lib/types";
import { useState, useEffect } from "react";

export const WATCHLIST_KEY = "watchlist";
export const WATCHLIST_UPDATED_EVENT = "watchlist-updated";

const normalizeType = (type?: string) => {
  if (type === "tvShow") return "tv";
  if (type === "tv") return "tv";
  return "movie";
};

const normalizeStoredMovie = (value: unknown): MovieProps | null => {
  if (!value || typeof value !== "object") return null;

  const movie = value as Partial<MovieProps> & {
    id?: number | string;
    type?: string;
  };

  if (movie.id === undefined || movie.id === null) return null;

  const numericId = Number(movie.id);
  if (Number.isNaN(numericId)) return null;

  return {
    ...(movie as MovieProps),
    id: numericId,
    type: normalizeType(movie.type),
  };
};

const isSameContent = (
  left: { id: number | string; type?: string },
  right: { id: number | string; type?: string }
) => String(left.id) === String(right.id) && normalizeType(left.type) === normalizeType(right.type);

export const loadWatchlist = (): MovieProps[] => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeStoredMovie(item))
      .filter((item): item is MovieProps => item !== null);
  } catch {
    return [];
  }
};

const useWatchlist = (movieId: string, movieType?: string) => {
  const [watchlist, setWatchlist] = useState<MovieProps[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      const storedWatchlist = loadWatchlist();
      setWatchlist(storedWatchlist);

      const target = { id: movieId, type: movieType };
      setIsInWatchlist(storedWatchlist.some((movie) => isSameContent(movie, target)));
    };

    syncFromStorage();
    window.addEventListener(WATCHLIST_UPDATED_EVENT, syncFromStorage);

    return () => {
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, syncFromStorage);
    };
  }, [movieId, movieType]);

  // Toggle movie in watchlist
  const toggleWatchlist = (movie: MovieProps) => {
    const currentWatchlist = loadWatchlist();
    const target = { ...movie, type: normalizeType(movie.type) };

    const exists = currentWatchlist.some((item) => isSameContent(item, target));
    const updatedWatchlist = exists
      ? currentWatchlist.filter((item) => !isSameContent(item, target))
      : [...currentWatchlist, target];

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    window.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT));
    setWatchlist(updatedWatchlist);
    setIsInWatchlist(!exists);
  };

  return { watchlist, isInWatchlist, toggleWatchlist };
};

export default useWatchlist;
