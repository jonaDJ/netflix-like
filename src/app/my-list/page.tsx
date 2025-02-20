"use client";

import GridCards from "@/components/ui/GridCards";
import { MovieProps } from "@/lib/types";
import React, { useEffect, useState } from "react";

const MyListPage: React.FC = () => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [watchListMovies, setWatchListMovies] = useState<MovieProps[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies`
        );
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const savedWatchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]"
    );

    if (movies.length > 0) {
      const filteredMovies = movies.filter((movie) =>
        savedWatchlist.includes(movie.id)
      );

      setWatchListMovies(filteredMovies);
    }
  }, [movies]);

  return (
    <div className="pt-[100px] min-h-screen bg-black px-4 md:px-8">
      <GridCards movies={watchListMovies} />
    </div>
  );
};

export default MyListPage;
