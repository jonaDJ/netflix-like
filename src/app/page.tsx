"use client";

import { useState, useEffect } from "react";
import { fetchGraphQL } from "../utils/graphql";
import HeroSection from "@/components/HeroSection";
import { MovieProps } from "@/lib/types";
import ContentRow from "@/components/ContentRow";
import { useSearchParams } from "next/navigation";
import MovieModal from "@/components/layout/MovieModal";

const Home = () => {
  const [popularItem, setPopularItem] = useState<MovieProps | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<MovieProps[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedContent, setSelectedContent] = useState<MovieProps | null>(
    null
  );

  const searchParams = useSearchParams();
  const jbv = searchParams.get("jbv");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularQuery = `
          query {
            popularContentOfTheDay {
              ... on Movie {
                id
                title
                slug
                backdropPath
                genres
                overview
                releaseDate
                type
              }
            }
          }
        `;
        const popularData = await fetchGraphQL(popularQuery);
        setPopularItem(popularData.popularContentOfTheDay);

        const trendingQuery = `
          query {
              contentByGenre(genre: "Action") {
                ... on Movie {
                  id
                  title
                  backdropPath
                  slug
                  genres
                  type
                }
                ... on TVShow {
                  id
                  title
                  backdropPath
                  slug
                  genres
                  type
                }
              }
            }
        `;
        const trendingData = await fetchGraphQL(trendingQuery);
        setTrendingMovies(trendingData.contentByGenre);

        const topRatedQuery = `
        query {
          contentByGenre(genre: "Drama") {
            ... on Movie {
              id
              title
              backdropPath
              slug
              genres
              type
            }
            ... on TVShow {
              id
              title
              backdropPath
              slug
              genres
              type
            }
          }
        }
      `;
        const topRatedData = await fetchGraphQL(topRatedQuery);
        setTopRatedMovies(topRatedData.contentByGenre);
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
          const query = `
            query {
              contentPreview(id: "${jbv}", type: "${type}") {
                ... on Movie {
                  id
                  title
                  slug
                  backdropPath
                  posterPath
                  genres
                  overview
                  releaseDate
                  rating
                  runtime
                  cast {
                    name
                  }
                  trailerUrl
                  languages
                  countries
                  type
                }
                ... on TVShow {
                  id
                  title
                  slug
                  backdropPath
                  posterPath
                  genres
                  overview
                  releaseDate
                  rating
                  numberOfSeasons
                  numberOfEpisodes
                  cast {
                    name
                  }
                  trailerUrl
                  languages
                  countries
                  type
                }
              }
            }
          `;
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-0">
      {popularItem && <HeroSection movie={popularItem} />}
      <ContentRow movies={trendingMovies} title="Trending Now" />
      <ContentRow movies={topRatedMovies} title="Top Rated" />
      {selectedContent && <MovieModal movie={selectedContent} />}
    </div>
  );
};

export default Home;
