"use client";

import HeroSection from "@/components/HeroSection";
import MovieModal from "@/components/layout/MovieModal";
import ScrollSection from "@/components/ScrollSection";
import { MovieProps } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [watchList, setWatchList] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParms = useSearchParams();
  const movieId = searchParms.get("movie-info");

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
        setError("Error fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const savedWatchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]"
    );

    const watchListMovies = savedWatchlist
      .map((movieId: number) => {
        return movies.find((movie) => movie.id === movieId);
      })
      .filter((movie: MovieProps) => movie !== undefined);

    setWatchList(watchListMovies);
  }, [movies]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  const featuredMovie = movies[0];
  const selectedMovie = movies.find((m) => String(m.id) === movieId);

  return (
    <div className="p-0">
      {featuredMovie && <HeroSection movie={featuredMovie} />}
      <div className="flex flex-col">
        {movies.length > 0 && (
          <ScrollSection movies={movies} title="Popular Movies" />
        )}
        {watchList.length > 0 && (
          <ScrollSection movies={watchList} title="Your Watchlist" />
        )}
      </div>
      {selectedMovie && <MovieModal movie={selectedMovie} />}
    </div>
  );
};

export default Home;
