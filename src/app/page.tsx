import Image from "next/image";
import Link from "next/link";
import movies from "../movies.json";

export default function Home() {
  return (
    <div className="p-4">
      <div className="text-3xl text-center font-bold mb-6">
        MOVIES CATEGORIES
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/watch/${movie.slug}`}
            className="cursor-pointer"
          >
            <Image
              src={movie.poster}
              alt={movie.title}
              width={300}
              height={200}
              className="w-full h-auto rounded-lg object-cover sm:h-[100px] md:h-[300px] lg:h-[150px] xl:h-[300px]"
            />
            <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
