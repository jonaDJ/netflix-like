"use client";

import React from "react";
import { useState, useEffect, memo } from "react";
import { fetchGraphQL } from "../utils/graphql";
import HeroSection from "../components/HeroSection";
import { MovieProps } from "../lib/types";
import ContentRow from "../components/ContentRow";
import { useSearchParams } from "next/navigation";
import MovieModal from "../components/layout/MovieModal";
import {
  CONTENT_PREVIEW_QUERY,
  MOVIES_BY_IDS_QUERY,
  POPULAR_CONTENT_QUERY,
  GENRE_CONTENT_QUERY,
  TOP_10_MOVIES_QUERY,
} from "../graphql/queries";
import ShimmerUI from "../components/layout/ShimmerUI";

// Define the genres you want to fetch
const genres = ["Animation", "Horror", "History", "Drama", "Action"];
const MemoizedContentRow = memo(ContentRow);

const Home = () => {
  const [popularItem, setPopularItem] = useState<MovieProps | null>(null);
  const [top10Movies, setTop10Movies] = useState<MovieProps[]>([]);

  const [genreContent, setGenreContent] = useState<
    Record<string, MovieProps[]>
  >({});

  const [loading, setLoading] = useState(true);

  const [selectedContent, setSelectedContent] = useState<MovieProps | null>(
    null
  );
  const [watchlistMovies, setWatchlistMovies] = useState<MovieProps[]>([]);

  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const jbv = searchParams.get("jbv");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularData = await fetchGraphQL(POPULAR_CONTENT_QUERY);
        setPopularItem(popularData.popularContentOfTheDay);

        const top10MovieData = await fetchGraphQL(TOP_10_MOVIES_QUERY);
        setTop10Movies(top10MovieData.top10Movies);

        const genreData = await Promise.all(
          genres.map(async (genre) => {
            const data = await fetchGraphQL(GENRE_CONTENT_QUERY(genre));
            return { genre, content: data.contentByGenre };
          })
        );
        const updatedGenreContent: Record<string, MovieProps[]> = {};
        genreData.forEach(({ genre, content }) => {
          updatedGenreContent[genre] = content;
        });
        setGenreContent(updatedGenreContent);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (jbv && type) {
      const fetchContentPreview = async () => {
        try {
          const query = CONTENT_PREVIEW_QUERY(jbv, type);
          const data = await fetchGraphQL(query);
          setSelectedContent(data.contentPreview);
        } catch (error) {
          console.error("Error fetching content preview:", error);
        }
      };

      fetchContentPreview();
    } else {
      setSelectedContent(null);
    }
  }, [jbv, type]);

  useEffect(() => {
    const savedWatchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]"
    );
    const idsOnly = savedWatchlist.map((movie: MovieProps) => String(movie.id));
    if (idsOnly.length > 0) {
      const reversedIds = idsOnly.reverse();
      const fetchWatchlistMovies = async () => {
        try {
          const data = await fetchGraphQL(MOVIES_BY_IDS_QUERY, {
            ids: reversedIds,
          });

          console.log("Fetched Watchlist Movies:", data.moviesByIds);

          setWatchlistMovies(data.moviesByIds.slice(0, 15));
          setWatchlistMovies(data.moviesByIds.slice(0, 15));
        } catch (error) {
          console.error("Error fetching watchlist movies:", error);
        }
      };
      fetchWatchlistMovies();
    }
  }, []);

  if (loading) return <ShimmerUI />;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-0">
      {popularItem && <HeroSection movie={popularItem} />}

      {top10Movies.length > 0 && (
        <MemoizedContentRow
          movies={top10Movies}
          title="Top 10 Movies in U.S. Today"
          top10={true}
        />
      )}

      {watchlistMovies.length > 0 && (
        <MemoizedContentRow movies={watchlistMovies} title="My List" />
      )}

      {Object.entries(genreContent).map(([genre, movies]) => (
        <MemoizedContentRow key={genre} movies={movies} title={genre} />
      ))}

      {selectedContent && <MovieModal movie={selectedContent} />}
    </div>
  );
};

export default Home;
