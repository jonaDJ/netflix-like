"use client";

import React from "react";
import { useState, useEffect, memo } from "react";
import { fetchGraphQL } from "../utils/graphql";
import HeroSection from "../components/HeroSection";
import { MovieProps } from "../lib/types";
import ContentRow from "../components/ContentRow";
import {
  MOVIES_BY_IDS_QUERY,
  POPULAR_CONTENT_QUERY,
  GENRE_CONTENT_QUERY,
  TOP_10_QUERY,
} from "../graphql/queries";
import ShimmerUI from "../components/layout/ShimmerUI";

// Define the genres you want to fetch
const genres = [
  { title: "Drama Films", name: "Drama" },
  { title: "Anime Hits", name: "Animation" },
  { title: "Action Movies", name: "Action" },
  { title: "Horror Hits", name: "Horror" },
  { title: "Sci-Fi Adventures", name: "Science Fiction" },
  { title: "Family Favorites", name: "Family" },
  { title: "Romantic Flicks", name: "Romance" },
];

const MemoizedContentRow = memo(ContentRow);

const Home = () => {
  const [popularItem, setPopularItem] = useState<MovieProps | null>(null);
  const [top10Movies, setTop10Movies] = useState<MovieProps[]>([]);

  const [genreContent, setGenreContent] = useState<
    Record<string, MovieProps[]>
  >({});

  const [loading, setLoading] = useState(true);

  const [watchlistMovies, setWatchlistMovies] = useState<MovieProps[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularData = await fetchGraphQL(POPULAR_CONTENT_QUERY);
        setPopularItem(popularData.popularContentOfTheDay);

        const top10Data = await fetchGraphQL(TOP_10_QUERY);
        setTop10Movies(top10Data.top10);

        const genreData = await Promise.all(
          genres.map(async ({ title, name }) => {
            const data = await fetchGraphQL(GENRE_CONTENT_QUERY(name));
            return { title, movies: data.contentByGenre };
          })
        );

        const updatedGenreContent: Record<string, MovieProps[]> = {};

        genreData.forEach(({ title, movies }) => {
          updatedGenreContent[title] = movies;
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

      {watchlistMovies.length > 0 && (
        <MemoizedContentRow movies={watchlistMovies} title="My List" />
      )}

      {top10Movies.length > 0 && (
        <MemoizedContentRow
          movies={top10Movies.slice(0, 10)}
          title="Top 10 Movies in U.S. Today"
          top10={true}
        />
      )}

      {Object.entries(genreContent).map(
        ([title, movies], index) =>
          index < 2 && (
            <MemoizedContentRow key={title} movies={movies} title={title} />
          )
      )}

      {top10Movies.length > 10 && (
        <MemoizedContentRow
          movies={top10Movies.slice(10, 20)}
          title="Top 10 Shows in U.S. Today"
          top10={true}
        />
      )}

      {Object.entries(genreContent).map(
        ([title, movies], index) =>
          index >= 2 && (
            <MemoizedContentRow key={title} movies={movies} title={title} />
          )
      )}
    </div>
  );
};

export default Home;
