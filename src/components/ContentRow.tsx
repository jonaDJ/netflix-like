import { MovieProps } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { LeftArrowIcon, RightArrowIcon } from "./icons/Icons";
import Wrapper from "./layout/Wrapper";
import MovieCard from "./ui/MovieCards";
import { useDynamicLayout } from "./contexts/DynamicLayoutContext";

interface ContentRowProps {
  movies: MovieProps[];
  title: string;
}

const ContentRow: React.FC<ContentRowProps> = ({ movies, title }) => {
  const [hovered, setHovered] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { itemWidthPercentage, visibleItems } = useDynamicLayout();

  useEffect(() => {
    if (!scrollRef.current) return;
    const scrollContainer = scrollRef.current;
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setIsAtStart(scrollLeft <= 5);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, visibleItems]);

  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.92;
    const offset = direction === "left" ? -scrollAmount : scrollAmount;

    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="my-[3vmin] pb-6">
      <Wrapper>
        <h2 className="text-h2 font-semibold mt-0 mb-[0.5em]">{title}</h2>
      </Wrapper>
      <div
        className="m-0 relative touch-action-pan-y"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={() => scrollToDirection("left")}
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-30  transition-opacity duration-200 shadow-md"
          style={{ width: "4%" }}
        >
          {!isAtStart && (
            <span className="bg-black bg-opacity-60 w-full h-full flex items-center justify-center hover:bg-opacity-30">
              {hovered && <LeftArrowIcon />}
            </span>
          )}
        </button>

        <div
          ref={scrollRef}
          className="px-[4%] grid relative grid-flow-col grid-rows-1 overflow-x-auto scroll-smooth hide-scrollbar transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidthPercentage}, 1fr))`,
            gridAutoColumns: `minmax(${itemWidthPercentage}, 1fr)`,
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => scrollToDirection("right")}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-30 rounded-r-md  transition-opacity duration-200 shadow-md"
          style={{ width: "4%" }}
        >
          {!isAtEnd && (
            <span className="bg-black bg-opacity-60 w-full h-full flex items-center justify-center hover:bg-opacity-30">
              {hovered && <RightArrowIcon />}
            </span>
          )}
        </button>
      </div>
    </section>
  );
};

export default ContentRow;
