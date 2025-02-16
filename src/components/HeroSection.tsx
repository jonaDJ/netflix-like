import Image from "next/image";
import Link from "next/link";
import { MovieProps } from "../lib/types";
import Wrapper from "./Wrapper";
import { PlayIcon } from "./icons/Icons";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  return (
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
            <Link
              href={`/watch/${movie.slug}`}
              className="text-button text-black bg-white hover:bg-gray-400 px-4 py-2 rounded flex items-center justify-center"
            >
              <PlayIcon dark />
              <span className="ml-1">Play</span>
            </Link>
            <Link
              href={`/`} // Will create a modal or additional info
              className="text-button bg-custom-gray-800 hover:bg-custom-gray-700 px-4 py-2 rounded flex items-center justify-center"
            >
              <div className="flex items-center">More Info</div>
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default HeroSection;
