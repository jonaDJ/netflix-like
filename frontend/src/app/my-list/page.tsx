"use client";

import ShimmerUI from "src/components/layout/ShimmerUI";
import GridCards from "../../components/ui/GridCards";
import { CONTENT_PREVIEW_QUERY } from "../../graphql/queries";
import { MovieProps } from "../../lib/types";
import { fetchGraphQL } from "../../utils/graphql";
import React, { useEffect, useState, Suspense } from "react";
import {
  WATCHLIST_UPDATED_EVENT,
  loadWatchlist,
} from "../../components/hooks/useWatchlist";

const MyListPage: React.FC = () => {
  const [watchListMovies, setWatchListMovies] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const handleWatchlistUpdated = () => {
      setReloadToken((prev) => prev + 1);
    };

    window.addEventListener(WATCHLIST_UPDATED_EVENT, handleWatchlistUpdated);

    return () => {
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, handleWatchlistUpdated);
    };
  }, []);

  useEffect(() => {
    const savedWatchlist = loadWatchlist();
    if (savedWatchlist.length === 0) {
      setWatchListMovies([]);
      return;
    }

    const orderedItems = [...savedWatchlist]
      .reverse()
      .map((movie) => ({
        id: String(movie.id),
        type: movie.type,
      }));

    const fetchWatchlistMovies = async () => {
      setLoading(true);
      setError(null);
      setWatchListMovies([]);

      try {
        const results = await Promise.all(
          orderedItems.map(async (item) => {
            try {
              const data = await fetchGraphQL(
                CONTENT_PREVIEW_QUERY(item.id, item.type)
              );
              return (data.contentPreview ?? null) as MovieProps | null;
            } catch {
              return null;
            }
          })
        );

        const movies = results.filter(
          (movie): movie is MovieProps => movie !== null
        );

        setWatchListMovies(movies);
      } catch (err) {
        console.error("Error fetching watchlist movies:", err);
        setError("Failed to fetch watchlist movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [reloadToken]);

  if (loading) return <ShimmerUI variant="grid" withNavOffset />;

  if (error) return <p className="text-brand-error text-center">{error}</p>;

  return (
    <Suspense fallback={<ShimmerUI variant="grid" withNavOffset />}>
      <div className="pt-[100px] min-h-screen bg-brand-bg px-4 md:px-8">
        <GridCards movies={watchListMovies} />
      </div>
    </Suspense>
  );
};

export default MyListPage;

