import Image from "next/image";
import { MovieProps } from "../lib/types";
import Wrapper from "./layout/Wrapper";
import { PlayIcon } from "./icons/Icons";
import Button from "./ui/Button";
import { useState } from "react";
import MovieModal from "./layout/MovieModal";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="relative aspect-[16/7] w-full min-w-[300px] overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bgBlack via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bgBlack via-transparent to-transparent"></div>
        <Wrapper>
          <div className="absolute bottom-10 max-w-lg">
            <h1 className="text-h1">{movie.title}</h1>
            <p className="text-p mt-4">
              {movie.description || `${movie.genre} - ${movie.year}`}
            </p>
            <div className="mt-6 flex space-x-4">
              <Button
                href={`/watch/${movie.slug}`}
                icon={<PlayIcon dark />}
                text="Play"
                bgColor="bg-white"
                textColor="text-black"
                hoverColor="hover:bg-gray-400"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-custom-gray-800 hover:bg-custom-gray-700 px-4 py-2 rounded text-white"
              >
                More Info
              </button>
            </div>
          </div>
        </Wrapper>
      </div>
      {isModalOpen && (
        <MovieModal movie={movie} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default HeroSection;
