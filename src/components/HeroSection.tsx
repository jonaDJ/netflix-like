import Image from "next/image";
import Link from "next/link";
import { MovieProps } from "../lib/types";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  return (
    <div className="relative h-[40vh] w-full sm:h-[60vh] md:h-[70vh] lg:h-[85vh]">
      <Image
        src={movie.poster}
        alt={movie.title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      <div className="absolute bottom-10 left-10 max-w-lg">
        <h1 className="text-h1">{movie.title}</h1>
        <p className="text-p mt-4">
          {movie.description || `${movie.genre} - ${movie.year}`}
        </p>
        <div className="mt-6 flex space-x-4">
          <Link
            type="button"
            href={`/watch/${movie.slug}`}
            className="text-button bg-red-600 hover:bg-red-700 px-8 py-3 rounded"
          >
            Watch Now
          </Link>
          <Link
            type="button"
            href={`/`} // Will create a modal or additional info
            className="text-button bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded"
          >
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
