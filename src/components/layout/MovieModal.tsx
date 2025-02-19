"use client";

import { MovieProps } from "@/lib/types";
import useWatchlist from "@/components/hooks/useWatchlist";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  PlayIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/icons/Icons";
import { useRouter } from "next/navigation";

interface MovieModalProps {
  movie: MovieProps;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(String(movie.id));
  const router = useRouter();

  const closeModal = () => {
    router.push("/", { scroll: false });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-[7%]">
      <div className="bg-black text-white rounded-md overflow-hidden relative">
        <div className="relative w-full h-[60vh]">
          <Image
            src={movie.poster}
            alt={movie.title}
            layout="fill"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <div className="flex space-x-4 mt-2">
              <Button
                href={`/watch/${movie.slug}`}
                icon={<PlayIcon dark />}
                text="Play"
                bgColor="bg-white"
                textColor="text-black"
                hoverColor="hover:bg-gray-400"
              />
              <button
                onClick={() => toggleWatchlist(movie)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              >
                {isInWatchlist ? <CheckIcon /> : <PlusIcon />}
              </button>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-[5%] py-[3%]">
          <p className="text-md text-gray-400">
            {movie.genre} • {movie.year}
          </p>
          <p className="text-md mt-[3%]">{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
