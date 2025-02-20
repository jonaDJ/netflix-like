"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { useEffect, useState } from "react";
import { MovieProps } from "@/lib/types";
import { BackIcon } from "@/components/icons/Icons";

const WatchPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieProps | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`http://localhost:5000/api/movies/${slug}`);
      if (!res.ok) return notFound();

      const data = await res.json();
      setMovie(data);
    };

    fetchMovie();
  }, [slug]);

  if (!movie) return notFound();

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center">
      <button
        aria-label="Go back"
        onClick={() => router.back()}
        className="absolute top-6 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
      >
        <BackIcon />
      </button>

      {movie.videoUrl ? (
        <VideoPlayer src={movie.videoUrl} />
      ) : (
        <p className="text-white text-xl">No video available for this movie.</p>
      )}
    </div>
  );
};

export default WatchPage;
