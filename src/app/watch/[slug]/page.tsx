"use client";

import { useParams, notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { useEffect, useState } from "react";
import { MovieProps } from "@/lib/types";

const WatchPage = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState<MovieProps | null>({
    id: 0,
    title: "",
    slug: "",
    poster: "",
  });

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`http://localhost:5000/api/movies/${slug}`);
      if (!res.ok) {
        console.log("response failed");
      }

      const data = await res.json();
      setMovie(data);
    };

    fetchMovie();
  }, [slug]);

  if (!movie) return notFound();

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mt-4">{movie.title}</h1>

      {movie.videoUrl ? (
        <div className="w-full max-w-6xl">
          <VideoPlayer src={movie.videoUrl} />
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No video available for this movie.
        </div>
      )}
    </div>
  );
};

export default WatchPage;
