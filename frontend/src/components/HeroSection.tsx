"use client";

import Image from "next/image";
import { MovieProps } from "../lib/types";
import Wrapper from "./ui/Wrapper";
import { InfoIcon, PlayIcon } from "./icons/Icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenMovie = () => {
    const jbv = movie.id;
    router.push(`${pathname}/?jbv=${jbv}&type=${movie.type}`, {
      scroll: false,
    });
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
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bgBlack via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bgBlack via-transparent to-transparent"></div>
        <Wrapper>
          <div className="absolute bottom-10 max-w-lg">
            <h1 className="text-h1">{movie.title}</h1>
            <p className="text-p mt-3"></p>
            <div className="flex space-x-4">
              <Link
                href={`/watch/${movie.id}?&type=${movie.type}`}
                className="text-button px-4 rounded flex gap-2 items-center justify-center transition-colors py-2 bg-white text-black hover:bg-gray-400"
              >
                <PlayIcon dark />
                Play
              </Link>
              <button
                onClick={handleOpenMovie}
                className="text-button bg-custom-gray-800 flex gap-2 items-center justify-center  hover:bg-custom-gray-700 px-4 py-2 rounded text-white"
              >
                <InfoIcon />
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
