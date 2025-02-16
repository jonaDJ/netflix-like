"use client";

import Image from "next/image";
import Link from "next/link";
import { MovieProps } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Link key={movie.id} href={`/watch/${movie.slug}`}>
              <div className="relative w-full aspect-[6/3] cursor-pointer">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="900px"
                  priority
                  className=" object-cover"
                />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
