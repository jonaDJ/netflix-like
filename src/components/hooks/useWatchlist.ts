import { MovieProps } from "@/lib/types";
import { useState, useEffect } from "react";

const WATCHLIST_KEY = "watchlist";

const useWatchlist = (movieId: string) => {
  const [watchlist, setWatchlist] = useState<MovieProps[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Load watchlist from localStorage
  useEffect(() => {
    const storedWatchlist = JSON.parse(
      localStorage.getItem(WATCHLIST_KEY) || "[]"
    );
    setWatchlist(storedWatchlist);
    setIsInWatchlist(
      storedWatchlist.some((movie: MovieProps) => String(movie.id) === movieId)
    );
  }, [movieId]);

  // Toggle movie in watchlist
  const toggleWatchlist = (movie: MovieProps) => {
    let updatedWatchlist = [...watchlist];

    if (isInWatchlist) {
      updatedWatchlist = updatedWatchlist.filter((m) => m.id !== movie.id);
    } else {
      updatedWatchlist.push(movie);
    }

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    setWatchlist(updatedWatchlist);
    setIsInWatchlist(!isInWatchlist);
  };

  return { watchlist, isInWatchlist, toggleWatchlist };
};

export default useWatchlist;
