"use client";

import { useParams, notFound } from "next/navigation";
import movies from "@/movies.json";
import VideoPlayer from "@/components/VideoPlayer";

interface MovieProps {
  id: number;
  title: string;
  slug: string;
  poster: string;
  videoUrl?: string;
}

const WatchPage = () => {
  const { slug } = useParams();
  const movie: MovieProps | undefined = movies.find((m) => m.slug === slug);

  if (!movie) return notFound();

  return (
    <div className="flex flex-col ">
      <h1 className="text-3xl font-bold mt-4">{movie.title}</h1>
      {movie.videoUrl ? (
        <div className="">
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
