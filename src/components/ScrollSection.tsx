import { MovieProps } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { LeftArrowIcon, RightArrowIcon } from "./icons/Icons";
import Wrapper from "./layout/Wrapper";

interface ScrollSectionProps {
  movies: MovieProps[];
  title: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ movies, title }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setIsAtStart(scrollLeft <= 5);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollAmount = () => {
    if (scrollRef.current) {
      const offset = 0.03 * scrollRef.current.clientWidth;
      return scrollRef.current.clientWidth - offset;
    }
    return 300;
  };

  const scrollLeftFunc = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    }
  };

  const scrollRightFunc = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    }
  };

  return (
    <section>
      <Wrapper>
        <h2 className="text-h2 font-semibold mb-2 md:mb-3 lg:mb-4 xl:mb-4">
          {title}
        </h2>
      </Wrapper>
      <div
        className="relative flex items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!isAtStart && hovered && (
          <button
            onClick={scrollLeftFunc}
            className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-30 p-2 hover:bg-opacity-50 transition-opacity duration-200 shadow-md"
          >
            <LeftArrowIcon />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar transition-all duration-300 pl-[3%]"
        >
          {movies.map((movie) => (
            <Link key={movie.id} href={`/watch/${movie.slug}`}>
              <div className="flex-shrink-0 w-[20vw] sm:w-[23vw] md:w-[20vw] lg:w-[15vw] xl:w-[12vw] aspect-[5/3] relative cursor-pointer">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                  priority
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
        {!isAtEnd && hovered && (
          <button
            onClick={scrollRightFunc}
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-30 p-2 rounded-r-md hover:bg-opacity-50 transition-opacity duration-200 shadow-md"
          >
            <RightArrowIcon />
          </button>
        )}
      </div>
    </section>
  );
};

export default ScrollSection;
