"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MovieProps } from "@/lib/types";
import { CONTENT_PREVIEW_QUERY } from "@/graphql/queries";
import { fetchGraphQL } from "@/utils/graphql";
import VideoPlayer from "@/components/VideoPlayer";

const WatchPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [movie, setMovie] = useState<MovieProps | null>(null);
  const stringId = Array.isArray(id) ? id[0] : id;
  useEffect(() => {
    if (stringId && type) {
      const fetchContentPreview = async () => {
        try {
          const query = CONTENT_PREVIEW_QUERY(stringId, type);
          const data = await fetchGraphQL(query);
          console.log(data, data.contentPreview.trailerUrl);
          setMovie(data.contentPreview);
        } catch (error) {
          console.error("Error fetching content preview:", error);
        }
      };

      fetchContentPreview();
    } else {
      setMovie(null);
    }
  }, [stringId, type]);

  return (
    <div className="relative w-screen h-screen bg-black flex justify-center ">
      {movie && movie.trailerUrl ? (
        <VideoPlayer src={movie.trailerUrl} />
      ) : (
        <p className="text-white text-xl">No video available for this movie.</p>
      )}
    </div>
  );
};

export default WatchPage;
