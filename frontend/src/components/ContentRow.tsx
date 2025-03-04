import { MovieProps } from "../lib/types";
import { useState, useEffect, useRef } from "react";
import { LeftArrowIcon, RightArrowIcon } from "./icons/Icons";
import Wrapper from "./ui/Wrapper";
import MovieCard from "./ui/MovieCards";
import { useDynamicLayout } from "./contexts/DynamicLayoutContext";
import PaginationIndicator from "./PaginationIndicator";

interface ContentRowProps {
  movies: MovieProps[];
  title: string;
  top10?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ movies, title, top10 }) => {
  const [hovered, setHovered] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { itemWidthPercentage, visibleItems } = useDynamicLayout();
  const [visibleMovies, setVisibleMovies] = useState<MovieProps[]>([]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleMovies(movies.slice(0, visibleItems * 2));
  }, [visibleItems, movies]);

  // IntersectionObserver to load more movies when the sentinel enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleMovies.length < movies.length) {
          const remainingItems = movies.length - visibleMovies.length;
          const itemsToAdd = Math.min(remainingItems, visibleItems);

          setVisibleMovies((prev) => [
            ...prev,
            ...movies.slice(prev.length, prev.length + itemsToAdd),
          ]);
        }
      },
      { root: scrollRef.current, threshold: 0.1 }
    );

    const sentinelNode = sentinelRef.current;

    if (sentinelNode) {
      observer.observe(sentinelNode);
    }

    return () => {
      if (sentinelNode) {
        observer.unobserve(sentinelNode);
      }
    };
  }, [visibleMovies, movies, visibleItems]);

  const scrollToDirection = (direction: string) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.92;
    const offset = direction === "left" ? -scrollAmount : scrollAmount;

    setCurrentIdx((prevIdx) => {
      if (direction === "left") {
        return Math.max(0, prevIdx - visibleItems);
      } else {
        const remainingItems = movies.length - (prevIdx + visibleItems);
        const itemsToMove = Math.min(remainingItems, visibleItems);
        return prevIdx + itemsToMove;
      }
    });

    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Watch scroll position to update currentIdx dynamically
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollPosition = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.clientWidth / visibleItems;
      const newIndex = Math.floor(scrollPosition / itemWidth);
      setCurrentIdx(newIndex);
    };

    const scrollContainer = scrollRef.current;
    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [visibleItems]);

  return (
    <section className="my-[4vmin]">
      <Wrapper>
        <h2 className="text-h2 font-semibold mt-0 mb-[0.2em]">{title}</h2>
      </Wrapper>
      <div
        className="m-0 relative touch-action-pan-y"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {movies.length > visibleItems && (
          <PaginationIndicator
            totalItems={movies.length}
            visibleItems={visibleItems}
            currentIdx={currentIdx}
          />
        )}
        <button
          onClick={() => scrollToDirection("left")}
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-30 transition-opacity duration-200 shadow-md"
          style={{ width: "4%" }}
          tabIndex={currentIdx === 0 ? -1 : 0}
        >
          {currentIdx !== 0 && (
            <span className="bg-black bg-opacity-60 w-full h-full flex items-center justify-center hover:bg-opacity-30">
              {hovered && <LeftArrowIcon />}
            </span>
          )}
        </button>

        <div
          ref={scrollRef}
          className="px-[4%] grid relative grid-flow-col grid-rows-1 overflow-x-auto scroll-smooth hide-scrollbar transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(${visibleItems}, minmax(${itemWidthPercentage}, 1fr))`,
            gridAutoColumns: `minmax(${itemWidthPercentage}, 1fr)`,
          }}
          tabIndex={-1}
        >
          {visibleMovies.map((movie, id) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={id + 1}
              top10={top10}
            />
          ))}
          {/* Sentinel element to trigger loading more items */}
          <div ref={sentinelRef} style={{ width: "1px" }} />
        </div>

        <button
          onClick={() => scrollToDirection("right")}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-30 rounded-r-md transition-opacity duration-200 shadow-md"
          style={{ width: "4%" }}
          tabIndex={currentIdx + visibleItems < movies.length ? 0 : -1}
        >
          {currentIdx + visibleItems < movies.length && (
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
