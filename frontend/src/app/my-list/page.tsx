"use client";

import ShimmerUI from "src/components/layout/ShimmerUI";
import GridCards from "../../components/ui/GridCards";
import { MOVIES_BY_IDS_QUERY } from "../../graphql/queries";
import { MovieProps } from "../../lib/types";
import { fetchGraphQL } from "../../utils/graphql";
import React, { useEffect, useState } from "react";

const MyListPage: React.FC = () => {
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [watchListMovies, setWatchListMovies] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const savedWatchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]"
    );
    const idsOnly = savedWatchlist.map((movie: MovieProps) => String(movie.id)); // Extract only IDs
    setWatchlistIds(idsOnly.reverse());
  }, []);

  useEffect(() => {
    if (watchlistIds.length === 0) return;

    const fetchWatchlistMovies = async () => {
      setLoading(true);
      setError(null);
      setWatchListMovies([]);

      try {
        const data = await fetchGraphQL(MOVIES_BY_IDS_QUERY, {
          ids: watchlistIds,
        });
        setWatchListMovies(data.moviesByIds);
      } catch (err) {
        console.error("Error fetching watchlist movies:", err);
        setError("Failed to fetch watchlist movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [watchlistIds]);
  if (loading) return <ShimmerUI />;

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="pt-[100px] min-h-screen bg-black px-4 md:px-8">
      <GridCards movies={watchListMovies} />
    </div>
  );
};

export default MyListPage;
