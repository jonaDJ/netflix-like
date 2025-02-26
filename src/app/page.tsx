"use client";

import { useState, useEffect } from "react";
import { fetchGraphQL } from "../utils/graphql";
import HeroSection from "@/components/HeroSection";
import { MovieProps } from "@/lib/types";
import ContentRow from "@/components/ContentRow";
import { useSearchParams } from "next/navigation";
import MovieModal from "@/components/layout/MovieModal";
import {
  CONTENT_PREVIEW_QUERY,
  MOVIES_BY_IDS_QUERY,
  POPULAR_CONTENT_QUERY,
  GENRE_CONTENT_QUERY,
  TOP_10_MOVIES_QUERY,
} from "@/graphql/queries";

// Define the genres you want to fetch
const genres = ["Animation", "Drama", "Action"];

const Home = () => {
  const [popularItem, setPopularItem] = useState<MovieProps | null>(null);
  const [top10Movies, setTop10Movies] = useState<MovieProps[]>([]);

  const [genreContent, setGenreContent] = useState<
    Record<string, MovieProps[]>
  >({});
  const [selectedContent, setSelectedContent] = useState<MovieProps | null>(
    null
  );
  const [watchlistMovies, setWatchlistMovies] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const jbv = searchParams.get("jbv");
  const type = searchParams.get("type");

  // Fetch popular content and genre-specific content
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch popular content
        const popularData = await fetchGraphQL(POPULAR_CONTENT_QUERY);
        setPopularItem(popularData.popularContentOfTheDay);

        const top10MovieData = await fetchGraphQL(TOP_10_MOVIES_QUERY);
        setTop10Movies(top10MovieData.top10Movies);
        console.log(top10MovieData);

        // Fetch data for all genres in parallel
        const genreData = await Promise.all(
          genres.map(async (genre) => {
            const data = await fetchGraphQL(GENRE_CONTENT_QUERY(genre));
            return { genre, content: data.contentByGenre };
          })
        );

        // Update genreContent state dynamically
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

  // Fetch content preview when URL params change
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

  // Fetch watchlist movies from local storage
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
        } catch (error) {
          console.error("Error fetching watchlist movies:", error);
        }
      };
      fetchWatchlistMovies();
    }
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-0">
      {popularItem && <HeroSection movie={popularItem} />}
      {top10Movies.length > 0 && (
        <ContentRow
          movies={top10Movies}
          title="Top 10 Movies in U.S. Today"
          top10={true}
        />
      )}

      {watchlistMovies.length > 0 && (
        <ContentRow movies={watchlistMovies} title="My List" />
      )}

      {Object.entries(genreContent).map(([genre, movies]) => (
        <ContentRow key={genre} movies={movies} title={genre} />
      ))}

      {selectedContent && <MovieModal movie={selectedContent} />}
    </div>
  );
};

export default Home;
