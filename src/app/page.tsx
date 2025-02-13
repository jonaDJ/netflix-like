"use client";

import HeroSection from "@/components/HeroSection";
import ScrollSection from "@/components/ScrollSection";
import { MovieProps } from "@/lib/types";
import { useEffect, useState } from "react";

const Home = () => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  const featuredMovie = movies[0];

  return (
    <div className="p-0">
      {featuredMovie && <HeroSection movie={featuredMovie} />}
      {movies.length > 0 && (
        <ScrollSection movies={movies} title="Popular Movies" />
      )}
    </div>
  );
};

export default Home;
