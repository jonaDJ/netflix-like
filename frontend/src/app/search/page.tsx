"use client";

import { MovieProps } from "../../lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GridCards from "../../components/ui/GridCards";
import { fetchGraphQL } from "../../utils/graphql";

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");
  const [results, setResults] = useState<MovieProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryParam) {
      const searchGraphQL = async () => {
        setLoading(true);
        setError(null);
        setResults([]);

        const searchQuery = `
            query SearchContent($query: String!) {
              search(query: $query) {
                ... on Movie {
                  id
                  title
                  overview
                  releaseDate
                  rating
                  posterPath
                  backdropPath
                  genres
                }
                ... on TVShow {
                  id
                  title
                  overview
                  releaseDate
                  rating
                  posterPath
                  backdropPath
                  genres
                }
              }
            }
          `;

        try {
          const data = await fetchGraphQL(searchQuery, { query: queryParam });
          setResults(data.search);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setError("Failed to fetch search results. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      searchGraphQL();
    }
  }, [queryParam]);

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="pt-[100px] min-h-screen bg-black px-4 md:px-8">
      <GridCards movies={results} />
    </div>
  );
};

export default SearchPage;
