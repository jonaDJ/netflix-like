import { MovieProps } from "@/lib/types";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { LeftArrowIcon, RightArrowIcon } from "./icons/Icons";
import Wrapper from "./layout/Wrapper";
import MoviePreview from "./layout/MoviePreview";

interface ScrollSectionProps {
  movies: MovieProps[];
  title: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ movies, title }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [hovered, setHovered] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [itemWidth, setItemWidth] = useState("25%");
  const [hoveredMovie, setHoveredMovie] = useState<MovieProps | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    movie: MovieProps
  ) => {
    setHoveredMovie(movie);

    // Calculate position ONLY on mouse enter:
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      left: rect.left,
      top: rect.top - 20,
    });
  };

  const handleMouseLeave = () => {
    setHoveredMovie(null);
    setPreviewPosition(null);
  };

  useEffect(() => {
    const updateItemWidth = () => {
      if (typeof window !== "undefined" && scrollRef.current) {
        const containerWidth = scrollRef.current.clientWidth;
        const numberOfItems = Math.max(Math.floor(containerWidth / 200), 3);

        const calculatedWidth = `${(100 / numberOfItems).toFixed(2)}%`;

        setItemWidth(calculatedWidth);
      }
    };

    updateItemWidth();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateItemWidth);
      return () => {
        window.removeEventListener("resize", updateItemWidth);
      };
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    setIsAtStart(scrollLeft <= 5);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.94;
    const offset = direction === "left" ? -scrollAmount : scrollAmount;

    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="mt-10">
      <Wrapper>
        <h2 className="text-h2 font-semibold mb-2 md:mb-3 lg:mb-4 xl:mb-4">
          {title}
        </h2>
      </Wrapper>
      <div
        className="m-0 relative touch-action-pan-y"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={() => scrollToDirection("left")}
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-30 bg-transparent bg-opacity-30 p-2 hover:bg-gray-700 transition-opacity duration-200 shadow-md"
          style={{ width: "3%" }}
        >
          {!isAtStart && hovered && <LeftArrowIcon />}
        </button>

        <div
          ref={scrollRef}
          className="px-[3%] grid relative grid-flow-col grid-rows-1 overflow-x-auto scroll-smooth hide-scrollbar transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}, 1fr))`,
            gridAutoColumns: `minmax(${itemWidth}, 1fr)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative flex items-center justify-center cursor-pointer px-[0.2vw]"
              onMouseEnter={(e) => handleMouseEnter(e, movie)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative w-full h-0 pb-[50%]">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add appropriate sizes for responsiveness
                  className="px-[.2vm]"
                />
              </div>
              {hoveredMovie === movie && previewPosition && (
                <MoviePreview movie={hoveredMovie} position={previewPosition} />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollToDirection("right")}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-30 bg-gray-800 bg-opacity-30 p-2 rounded-r-md hover:bg-opacity-50 transition-opacity duration-200 shadow-md"
          style={{ width: "3%" }}
        >
          {!isAtEnd && hovered && <RightArrowIcon />}
        </button>
      </div>
    </section>
  );
};

export default ScrollSection;
