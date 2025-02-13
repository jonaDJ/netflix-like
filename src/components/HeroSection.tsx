import Image from "next/image";
import Link from "next/link";
import { MovieProps } from "../lib/types";

interface HeroSectionProps {
  movie: MovieProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full">
      <Image
        src={movie.poster}
        alt={movie.title}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        priority
        className="brightness-75 object-cover"
      />
      <div className="absolute top-0 left-0 h-full w-full flex items-center">
        <div className="ml-8 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
          <p className=" mt-4 text-lg md:text-xl">
            {movie.description || `${movie.genre} - ${movie.year}`}
          </p>
          <Link href={`/watch/${movie.slug}`}>
            <div className="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition">
              Watch Now
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
