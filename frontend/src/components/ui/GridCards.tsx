import React, { useEffect, useState } from "react";
import { MovieProps } from "../../lib/types";
import MovieCard from "./MovieCards";
import { useDynamicLayout } from "../contexts/DynamicLayoutContext";

interface GridCardsProps {
  movies: MovieProps[];
}

const GridCards: React.FC<GridCardsProps> = ({ movies }) => {
  const { itemWidthPercentage } = useDynamicLayout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="grid gap-y-14"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidthPercentage}, 1fr))`,
        gridAutoColumns: `minmax(${itemWidthPercentage}, 1fr)`,
      }}
    >
      {movies.length > 0 ? (
        movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      ) : (
        <p className="text-white text-center col-span-full">
          No results found.
        </p>
      )}
    </div>
  );
};

export default GridCards;
