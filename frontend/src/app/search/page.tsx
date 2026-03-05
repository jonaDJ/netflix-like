"use client";

import { MovieProps } from "../../lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import GridCards from "../../components/ui/GridCards";
import { fetchGraphQL } from "../../utils/graphql";
import ShimmerUI from "src/components/layout/ShimmerUI";
import { SEARCH_CONTENT_QUERY } from "../../graphql/queries";

interface PageInfo {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const SEARCH_PAGE_LIMIT = 24;

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");
  const [results, setResults] = useState<MovieProps[]>([]);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [queryParam]);

  useEffect(() => {
    if (queryParam) {
      const searchGraphQL = async () => {
        setLoading(true);
        setError(null);
        setResults([]);

        try {
          const data = await fetchGraphQL(SEARCH_CONTENT_QUERY, {
            query: queryParam,
            page,
            limit: SEARCH_PAGE_LIMIT,
          });

          setResults(data.search.items);
          setPageInfo(data.search.pageInfo);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setError("Failed to fetch search results. Please try again later.");
          setPageInfo(null);
        } finally {
          setLoading(false);
        }
      };

      searchGraphQL();
    } else {
      setResults([]);
      setPageInfo(null);
    }
  }, [queryParam, page]);

  if (loading) {
    return <ShimmerUI variant="grid" withNavOffset />;
  }

  if (error) {
    return <div className="text-center mt-10 text-brand-error">{error}</div>;
  }

  return (
    <div className="pt-[100px] min-h-screen bg-brand-bg px-4 md:px-8">
      <GridCards movies={results} />
      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-8">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={!pageInfo.hasPreviousPage || loading}
            className="px-4 py-2 text-sm border border-brand-outline disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-brand-textMuted">
            Page {pageInfo.page} of {pageInfo.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!pageInfo.hasNextPage || loading}
            className="px-4 py-2 text-sm border border-brand-outline disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={<ShimmerUI variant="grid" withNavOffset />}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;

