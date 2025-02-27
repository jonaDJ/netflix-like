"use client";

import Image from "next/image";
import { MovieProps } from "../lib/types";
import Wrapper from "./layout/Wrapper";
import { PlayIcon } from "./icons/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const router = useRouter();

  const handleOpenMovie = () => {
    const jbv = movie.id;
    router.push(`/?jbv=${jbv}&type=${movie.type}`, { scroll: false });
  };

  return (
    <>
      <div className="relative aspect-[16/7] w-full min-w-[300px] overflow-hidden">
        <Image
          priority
          src={movie.backdropPath}
          alt={movie.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bgBlack via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bgBlack via-transparent to-transparent"></div>
        <Wrapper>
          <div className="absolute bottom-10 max-w-lg">
            <h1 className="text-h1">{movie.title}</h1>
            <p className="text-p mt-4"></p>
            <div className="mt-6 flex space-x-4">
              <Link
                href={`/watch/${movie.id}?&type=${movie.type}`}
                className="text-button px-4 rounded flex gap-2 items-center justify-center transition-colors bg-white text-black hover:bg-gray-400"
              >
                <PlayIcon dark />
                Play
              </Link>
              <button
                onClick={handleOpenMovie}
                className="text-button bg-custom-gray-800 hover:bg-custom-gray-700 px-4 py-2 rounded text-white"
              >
                More Info
              </button>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default HeroSection;
