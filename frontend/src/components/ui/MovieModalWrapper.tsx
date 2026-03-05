"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MovieModal from "../layout/MovieModal";
import { fetchGraphQL } from "../../utils/graphql";
import { CONTENT_PREVIEW_QUERY } from "../../graphql/queries";
import { MovieProps } from "../../lib/types";

interface MovieModalWrapperProps {
  children: React.ReactNode;
}

const MovieModalWrapper: React.FC<MovieModalWrapperProps> = ({ children }) => {
  const [selectedContent, setSelectedContent] = useState<MovieProps | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jbv = searchParams.get("jbv");
  const type = searchParams.get("type");

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("jbv");
    params.delete("type");

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    setSelectedContent(null);
    router.replace(nextUrl, { scroll: false });
  };

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

  return (
    <>
      {children}
      {selectedContent && (
        <MovieModal movie={selectedContent} onClose={closeModal} />
      )}
    </>
  );
};

export default MovieModalWrapper;
