"use client";

import React from "react";
import { useState, useEffect, memo } from "react";
import { fetchGraphQL } from "../utils/graphql";
import HeroSection from "../components/HeroSection";
import { MovieProps } from "../lib/types";
import ContentRow from "../components/ContentRow";
import ContinueWatchingRow from "../components/ContinueWatchingRow";
import {
  WATCHLIST_UPDATED_EVENT,
  loadWatchlist,
} from "../components/hooks/useWatchlist";
import {
  CONTENT_PREVIEW_QUERY,
  POPULAR_CONTENT_QUERY,
  GENRE_CONTENT_QUERY,
  TOP_10_QUERY,
} from "../graphql/queries";
import ShimmerUI from "../components/layout/ShimmerUI";
import { useProfile } from "../components/contexts/ProfileContext";
import {
  CONTINUE_WATCHING_UPDATED_EVENT,
  loadContinueWatching,
  removeWatchProgressByIds,
} from "../utils/profileStorage";

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
const KIDS_ALLOWED_GENRES = new Set([16, 35, 10751, 10762, 12, 14]);
const KIDS_BLOCKED_GENRES = new Set([27, 53, 80]);
const GENRE_PAGE_LIMIT = 20;

interface GenreRowState {
  movies: MovieProps[];
  page: number;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

const getContentKey = (item: MovieProps) => `${item.type}:${item.id}`;

const Home = () => {
  const { activeProfile, isKidsMode } = useProfile();
  const [popularItem, setPopularItem] = useState<MovieProps | null>(null);
  const [top10Movies, setTop10Movies] = useState<MovieProps[]>([]);

  const [genreContent, setGenreContent] = useState<Record<string, GenreRowState>>(
    {}
  );

  const [loading, setLoading] = useState(true);

  const [watchlistMovies, setWatchlistMovies] = useState<MovieProps[]>([]);
  const [watchlistReloadToken, setWatchlistReloadToken] = useState(0);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<
    MovieProps[]
  >([]);
  const [continueProgressById, setContinueProgressById] = useState<
    Record<string, number>
  >({});
  const [continueReloadToken, setContinueReloadToken] = useState(0);

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
            const data = await fetchGraphQL(GENRE_CONTENT_QUERY, {
              genre: name,
              page: 1,
              limit: GENRE_PAGE_LIMIT,
            });
            return {
              title,
              payload: data.contentByGenre,
            };
          })
        );

        const updatedGenreContent: Record<string, GenreRowState> = {};

        genreData.forEach(({ title, payload }) => {
          updatedGenreContent[title] = {
            movies: payload.items,
            page: payload.pageInfo.page,
            hasNextPage: payload.pageInfo.hasNextPage,
            isLoadingMore: false,
          };
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
    const handleContinueWatchingUpdated = () => {
      setContinueReloadToken((prev) => prev + 1);
    };

    window.addEventListener(
      CONTINUE_WATCHING_UPDATED_EVENT,
      handleContinueWatchingUpdated
    );

    return () => {
      window.removeEventListener(
        CONTINUE_WATCHING_UPDATED_EVENT,
        handleContinueWatchingUpdated
      );
    };
  }, []);

  useEffect(() => {
    if (!activeProfile) return;

    const progressItems = loadContinueWatching(activeProfile.id);
    if (progressItems.length === 0) {
      setContinueWatchingMovies([]);
      setContinueProgressById({});
      return;
    }

    const progressMap: Record<string, number> = {};
    progressItems.forEach((item) => {
      progressMap[item.id] = item.played;
    });

    const fetchContinueWatching = async () => {
      try {
        const results = await Promise.all(
          progressItems.map(async (item) => {
            try {
              const data = await fetchGraphQL(
                CONTENT_PREVIEW_QUERY(item.id, item.type)
              );
              const movie = (data.contentPreview ?? null) as MovieProps | null;

              if (!movie) {
                return { id: item.id, movie: null };
              }

              return { id: item.id, movie };
            } catch {
              return { id: item.id, movie: null };
            }
          })
        );

        const missingIds = results
          .filter((result) => !result.movie)
          .map((result) => result.id);

        if (missingIds.length > 0) {
          removeWatchProgressByIds(activeProfile.id, missingIds);
        }

        const orderedMovies = results
          .map((result) => result.movie)
          .filter((movie): movie is MovieProps => movie !== null)
          .slice(0, 20);

        const validProgressMap: Record<string, number> = {};
        orderedMovies.forEach((movie) => {
          const id = String(movie.id);
          if (typeof progressMap[id] === "number") {
            validProgressMap[id] = progressMap[id];
          }
        });

        setContinueProgressById(validProgressMap);
        setContinueWatchingMovies(orderedMovies);
      } catch (err) {
        console.error("Error fetching continue watching data:", err);
      }
    };

    fetchContinueWatching();
  }, [activeProfile, continueReloadToken]);

  useEffect(() => {
    const handleWatchlistUpdated = () => {
      setWatchlistReloadToken((prev) => prev + 1);
    };

    window.addEventListener(WATCHLIST_UPDATED_EVENT, handleWatchlistUpdated);

    return () => {
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, handleWatchlistUpdated);
    };
  }, []);

  useEffect(() => {
    const savedWatchlist = loadWatchlist();
    if (savedWatchlist.length === 0) {
      setWatchlistMovies([]);
      return;
    }

    const orderedItems = [...savedWatchlist]
      .reverse()
      .map((movie) => ({
        id: String(movie.id),
        type: movie.type,
      }));

    const fetchWatchlistMovies = async () => {
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

        const movies = results
          .filter((movie): movie is MovieProps => movie !== null)
          .slice(0, 15);

        setWatchlistMovies(movies);
      } catch (error) {
        console.error("Error fetching watchlist movies:", error);
      }
    };
    fetchWatchlistMovies();
  }, [watchlistReloadToken]);

  const loadMoreGenreContent = async (title: string) => {
    const genreConfig = genres.find((genre) => genre.title === title);
    if (!genreConfig) return;

    const current = genreContent[title];
    if (!current || current.isLoadingMore || !current.hasNextPage) return;

    setGenreContent((prev) => {
      const existing = prev[title];
      if (!existing) return prev;

      return {
        ...prev,
        [title]: {
          ...existing,
          isLoadingMore: true,
        },
      };
    });

    try {
      const nextPage = current.page + 1;
      const data = await fetchGraphQL(GENRE_CONTENT_QUERY, {
        genre: genreConfig.name,
        page: nextPage,
        limit: GENRE_PAGE_LIMIT,
      });

      const payload = data.contentByGenre;

      setGenreContent((prev) => {
        const existing = prev[title];
        if (!existing) return prev;

        const seen = new Set(existing.movies.map(getContentKey));
        const newItems = payload.items.filter(
          (item: MovieProps) => !seen.has(getContentKey(item))
        );

        return {
          ...prev,
          [title]: {
            movies: [...existing.movies, ...newItems],
            page: payload.pageInfo.page,
            hasNextPage: payload.pageInfo.hasNextPage,
            isLoadingMore: false,
          },
        };
      });
    } catch (error) {
      console.error(`Error fetching more genre content for ${title}:`, error);
      setGenreContent((prev) => {
        const existing = prev[title];
        if (!existing) return prev;

        return {
          ...prev,
          [title]: {
            ...existing,
            isLoadingMore: false,
          },
        };
      });
    }
  };

  const isKidsSafe = (movie: MovieProps) => {
    const blocked = movie.genres.some((id) => KIDS_BLOCKED_GENRES.has(id));
    const allowed = movie.genres.some((id) => KIDS_ALLOWED_GENRES.has(id));
    return !blocked && allowed;
  };

  const filteredTop10 = isKidsMode ? top10Movies.filter(isKidsSafe) : top10Movies;
  const filteredWatchlist = isKidsMode
    ? watchlistMovies.filter(isKidsSafe)
    : watchlistMovies;
  const filteredContinueWatching = isKidsMode
    ? continueWatchingMovies.filter(isKidsSafe)
    : continueWatchingMovies;

  const filteredGenreContent = Object.entries(genreContent).reduce(
    (acc, [title, row]) => {
      acc[title] = {
        ...row,
        movies: isKidsMode ? row.movies.filter(isKidsSafe) : row.movies,
      };
      return acc;
    },
    {} as Record<string, GenreRowState>
  );

  const heroMovie = isKidsMode
    ? (popularItem && isKidsSafe(popularItem)
        ? popularItem
        : filteredTop10[0] || filteredWatchlist[0] || filteredContinueWatching[0]) ??
      null
    : popularItem;

  if (loading) return <ShimmerUI variant="rows" />;
  if (error)
    return <div className="text-center mt-10 text-brand-error">{error}</div>;

  return (
    <div className="p-0">
      {heroMovie && <HeroSection movie={heroMovie} />}

      {filteredWatchlist.length > 0 && (
        <MemoizedContentRow movies={filteredWatchlist} title="My List" />
      )}

      {filteredContinueWatching.length > 0 && (
        <ContinueWatchingRow
          movies={filteredContinueWatching}
          progressById={continueProgressById}
          title={
            isKidsMode
              ? "Still in Progress"
              : `Continue Watching for ${activeProfile?.name ?? "Jon"}`
          }
        />
      )}

      {filteredTop10.length > 0 && (
        <MemoizedContentRow
          movies={filteredTop10.slice(0, 10)}
          title="Top 10 Movies in U.S. Today"
          top10={true}
        />
      )}

      {Object.entries(filteredGenreContent).map(
        ([title, row], index) =>
          index < 2 &&
          row.movies.length > 0 && (
            <MemoizedContentRow
              key={title}
              movies={row.movies}
              title={title}
              hasMore={row.hasNextPage}
              isLoadingMore={row.isLoadingMore}
              onLoadMore={() => loadMoreGenreContent(title)}
              enableExploreAll
            />
          )
      )}

      {filteredTop10.length > 10 && (
        <MemoizedContentRow
          movies={filteredTop10.slice(10, 20)}
          title="Top 10 Shows in U.S. Today"
          top10={true}
        />
      )}

      {Object.entries(filteredGenreContent).map(
        ([title, row], index) =>
          index >= 2 &&
          row.movies.length > 0 && (
            <MemoizedContentRow
              key={title}
              movies={row.movies}
              title={title}
              hasMore={row.hasNextPage}
              isLoadingMore={row.isLoadingMore}
              onLoadMore={() => loadMoreGenreContent(title)}
              enableExploreAll
            />
          )
      )}
    </div>
  );
};

export default Home;
