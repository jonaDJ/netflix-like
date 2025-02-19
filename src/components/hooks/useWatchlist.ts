import { useState, useEffect, useCallback } from "react";
import { MovieProps } from "@/lib/types";

const useWatchlist = (movieId: string) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const checkWatchlist = useCallback(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setIsInWatchlist(watchlist.includes(Number(movieId)));
  }, [movieId]);

  useEffect(() => {
    checkWatchlist();
    window.addEventListener("storage", checkWatchlist);

    return () => {
      window.removeEventListener("storage", checkWatchlist);
    };
  }, [checkWatchlist]);

  const toggleWatchlist = (movie: MovieProps) => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

    if (watchlist.includes(movie.id)) {
      watchlist = watchlist.filter((id: number) => id !== movie.id);
    } else {
      watchlist.push(movie.id);
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    setIsInWatchlist(!isInWatchlist);
  };

  return { isInWatchlist, toggleWatchlist, checkWatchlist };
};

export default useWatchlist;
