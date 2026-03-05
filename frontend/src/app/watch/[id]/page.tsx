"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { MovieProps } from "../../../lib/types";
import { CONTENT_PREVIEW_QUERY } from "../../../graphql/queries";
import { fetchGraphQL } from "../../../utils/graphql";
import VideoPlayer from "../../../components/VideoPlayer";
import { BackIcon } from "../../../components/icons/Icons";

const WatchPageContent = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [movie, setMovie] = useState<MovieProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stringId = Array.isArray(id) ? id[0] : id;

  const BackButton = () => (
    <button
      aria-label="Go back"
      onClick={() => router.back()}
      className="absolute left-6 top-6 bg-brand-overlaySoft text-brand-text p-3 rounded-full hover:bg-brand-overlaySubtle transition"
    >
      <BackIcon />
    </button>
  );

  useEffect(() => {
    const fetchContentPreview = async () => {
      if (!stringId || !type) {
        setError("Invalid movie ID or type.");
        setLoading(false);
        return;
      }

      try {
        const query = CONTENT_PREVIEW_QUERY(stringId, type);
        const data = await fetchGraphQL(query);
        setMovie(data.contentPreview);
      } catch (error) {
        console.error("Error fetching content preview:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContentPreview();
  }, [stringId, type]);

  if (loading) {
    return (
      <div className="relative w-screen h-[100dvh] bg-brand-bg flex items-center justify-center">
        <div className="w-full h-full max-w-4xl max-h-[60vh] bg-brand-elevated animate-pulse rounded-lg"></div>
        <BackButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-[100dvh] bg-brand-bg flex flex-col items-center justify-center gap-4">
        <p className="text-brand-text text-xl">{error}</p>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-[100dvh] bg-brand-bg flex items-center justify-center">
      {movie && movie.trailerUrl ? (
        <VideoPlayer
          src={movie.trailerUrl}
          contentId={String(movie.id)}
          contentType={movie.type}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="px-[10%] text-brand-error text-xl text-center">
            Sorry, we dont have a video for this movie yet. We are working on
            adding more videos. Please check out another one!
          </p>
          <BackButton />
        </div>
      )}
    </div>
  );
};

const WatchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchPageContent />
    </Suspense>
  );
};

export default WatchPage;
