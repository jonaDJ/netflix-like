"use client";

import { MovieProps } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GridCards from "@/components/ui/GridCards";

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [movies, setMovies] = useState<MovieProps[]>([]);

  useEffect(() => {
    if (query) {
      setMovies([]); // Clear old results before fetching new ones
      fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setMovies(data))
        .catch((err) => console.error("Error fetching search results:", err));
    }
  }, [query]);

  return (
    <div className="pt-[100px] min-h-screen bg-black px-4 md:px-8">
      <GridCards movies={movies} />
    </div>
  );
};

export default SearchPage;
