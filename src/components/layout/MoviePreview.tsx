"use client";

import { MovieProps } from "@/lib/types";
import useWatchlist from "@/components/hooks/useWatchlist";
import Image from "next/image";
import { PlayIcon, CheckIcon, DownArrowIcon, PlusIcon } from "../icons/Icons";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

interface MoviePreviewProps {
  movie: MovieProps;
  position: { left: number; top: number };
  baseImageWidth: string;
}

const MoviePreview: React.FC<MoviePreviewProps> = ({
  movie,
  position,
  baseImageWidth,
}) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(String(movie.id));
  const router = useRouter();

  const baseWidth = parseFloat(baseImageWidth);
  const widthPercentage = `${baseWidth * 1.2}%`;
  const marginPercentage = `${baseWidth * 1}%`;

  return (
    <div
      className="absolute z-20 bg-black text-white rounded-md zoomInOut"
      style={{
        left: `${position.left - parseFloat(marginPercentage)}px`,
        top: `${position.top - parseFloat(marginPercentage)}px`,
        width: widthPercentage,
        position: "fixed",
        zIndex: 40,
      }}
    >
      <div className="relative w-full h-[8rem] overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-3 pt-1">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2 m-2 ml-0">
            <Button
              onClick={() => {
                router.push(`/watch/${movie.slug}`);
              }}
              icon={<PlayIcon dark />}
              className="bg-white"
            />
            <Button
              onClick={() => toggleWatchlist(movie)}
              icon={isInWatchlist ? <CheckIcon /> : <PlusIcon />}
              className="bg-gray-800 p-1.5"
            />
          </div>
          <div>
            <Button
              onClick={() =>
                router.push(`/?movie-info=${movie.id}`, { scroll: false })
              }
              icon={<DownArrowIcon />}
              className="bg-gray-800"
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
        {/* Genre List */}
        <div className="mt-1 flex items-center text-sm text-gray-400">
          {movie.genre.map((genre, index) => (
            <span key={genre} className="flex items-center">
              {index !== 0 && <span className="mx-1">&bull;</span>}
              <span>{genre}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePreview;
