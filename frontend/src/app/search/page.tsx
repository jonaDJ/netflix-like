"use client";

import { MovieProps } from "../../lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import GridCards from "../../components/ui/GridCards";
import { fetchGraphQL } from "../../utils/graphql";
import ShimmerUI from "src/components/layout/ShimmerUI";

const SearchPageContent = () => {
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
                type
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
                type
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
    return <ShimmerUI />;
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

const SearchPage = () => {
  return (
    <Suspense fallback={<ShimmerUI />}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
