import { MovieProps } from "../lib/types";
import { useState, useEffect, useRef } from "react";
import { LeftArrowIcon, RightArrowIcon } from "./icons/Icons";
import Wrapper from "./ui/Wrapper";
import MovieCard from "./ui/MovieCards";
import { useDynamicLayout } from "./contexts/DynamicLayoutContext";
import PaginationIndicator from "./PaginationIndicator";
import RowExploreModal from "./layout/RowExploreModal";

interface ContentRowProps {
  movies: MovieProps[];
  title: string;
  top10?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => Promise<void> | void;
  enableExploreAll?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({
  movies,
  title,
  top10,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  enableExploreAll = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { itemWidthPercentage, visibleItems } = useDynamicLayout();
  const effectiveVisibleItems = visibleItems > 0 ? visibleItems : 1;
  const [visibleMovies, setVisibleMovies] = useState<MovieProps[]>([]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadMoreTriggeredRef = useRef(false);

  useEffect(() => {
    setVisibleMovies((prev) => {
      if (movies.length < prev.length) {
        return movies.slice(0, effectiveVisibleItems * 2);
      }

      const targetCount = Math.max(effectiveVisibleItems * 2, prev.length);
      return movies.slice(0, targetCount);
    });
  }, [effectiveVisibleItems, movies]);

  // IntersectionObserver to load more movies when the sentinel enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleMovies.length < movies.length) {
          const remainingItems = movies.length - visibleMovies.length;
          const itemsToAdd = Math.min(remainingItems, effectiveVisibleItems);

          setVisibleMovies((prev) => [
            ...prev,
            ...movies.slice(prev.length, prev.length + itemsToAdd),
          ]);
          return;
        }

        if (
          entries[0].isIntersecting &&
          visibleMovies.length >= movies.length &&
          hasMore &&
          onLoadMore &&
          !isLoadingMore &&
          !loadMoreTriggeredRef.current
        ) {
          loadMoreTriggeredRef.current = true;
          void Promise.resolve(onLoadMore()).catch(() => undefined);
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
  }, [
    visibleMovies,
    movies,
    effectiveVisibleItems,
    hasMore,
    isLoadingMore,
    onLoadMore,
  ]);

  useEffect(() => {
    if (!isLoadingMore) {
      loadMoreTriggeredRef.current = false;
    }
  }, [isLoadingMore, movies.length]);

  useEffect(() => {
    const maxStartIndex = Math.max(0, movies.length - effectiveVisibleItems);
    setCurrentIdx((previous) => Math.min(previous, maxStartIndex));
  }, [effectiveVisibleItems, movies.length]);

  const getTrackViewportWidth = (element: HTMLDivElement) => {
    const computedStyles = window.getComputedStyle(element);
    const paddingLeft = parseFloat(computedStyles.paddingLeft || "0");
    const paddingRight = parseFloat(computedStyles.paddingRight || "0");
    return Math.max(1, element.clientWidth - paddingLeft - paddingRight);
  };

  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const maxStartIndex = Math.max(0, movies.length - effectiveVisibleItems);
    const targetIdx =
      direction === "left"
        ? Math.max(0, currentIdx - effectiveVisibleItems)
        : Math.min(currentIdx + effectiveVisibleItems, maxStartIndex);

    const pageWidth = getTrackViewportWidth(scrollRef.current);
    const itemWidth = pageWidth / effectiveVisibleItems;
    scrollRef.current.scrollTo({ left: targetIdx * itemWidth, behavior: "smooth" });
    setCurrentIdx(targetIdx);
  };

  // Watch scroll position to update currentIdx dynamically
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        if (!scrollRef.current) {
          ticking = false;
          return;
        }

        const scrollPosition = scrollRef.current.scrollLeft;
        const pageWidth = getTrackViewportWidth(scrollRef.current);
        const maxStartIndex = Math.max(0, movies.length - effectiveVisibleItems);
        const pageIndex = Math.round(scrollPosition / pageWidth);
        const nextIndex = Math.min(pageIndex * effectiveVisibleItems, maxStartIndex);

        setCurrentIdx((previous) => (previous === nextIndex ? previous : nextIndex));
        ticking = false;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [effectiveVisibleItems, movies.length]);

  return (
    <section className="my-[4vmin]">
      <Wrapper>
        <div className="group flex w-fit items-center gap-3">
          <h2 className="text-h2 font-semibold mt-0 mb-[0.2em]">{title}</h2>
          {enableExploreAll && movies.length > effectiveVisibleItems && (
            <button
              type="button"
              onClick={() => setIsExploreOpen(true)}
              className="text-sm text-brand-textMuted transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 focus:translate-x-0 focus:opacity-100"
            >
              Explore All &gt;
            </button>
          )}
        </div>
      </Wrapper>
      <div
        className="m-0 relative touch-action-pan-y"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {movies.length > effectiveVisibleItems && (
          <PaginationIndicator
            totalItems={movies.length}
            visibleItems={effectiveVisibleItems}
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
            <span className="bg-brand-overlaySoft w-full h-full flex items-center justify-center hover:bg-brand-overlaySubtle">
              {hovered && <LeftArrowIcon />}
            </span>
          )}
        </button>

        <div
          ref={scrollRef}
          className="px-[4%] grid relative grid-flow-col grid-rows-1 overflow-x-auto scroll-smooth hide-scrollbar transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(${effectiveVisibleItems}, minmax(${itemWidthPercentage}, 1fr))`,
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
          tabIndex={currentIdx + effectiveVisibleItems < movies.length ? 0 : -1}
        >
          {currentIdx + effectiveVisibleItems < movies.length && (
            <span className="bg-brand-overlaySoft w-full h-full flex items-center justify-center hover:bg-brand-overlaySubtle">
              {hovered && <RightArrowIcon />}
            </span>
          )}
        </button>
      </div>

      {isExploreOpen && (
        <RowExploreModal
          title={title}
          movies={movies}
          onClose={() => setIsExploreOpen(false)}
        />
      )}
    </section>
  );
};

export default ContentRow;
