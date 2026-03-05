"use client";

import { useRef, useState } from "react";
import Wrapper from "./ui/Wrapper";
import { MovieProps } from "../lib/types";
import { LeftArrowIcon, RightArrowIcon } from "./icons/Icons";
import { useDynamicLayout } from "./contexts/DynamicLayoutContext";
import PaginationIndicator from "./PaginationIndicator";
import MovieCard from "./ui/MovieCards";
import { useProfile } from "./contexts/ProfileContext";
import { removeWatchProgress } from "../utils/profileStorage";

interface ContinueWatchingRowProps {
  movies: MovieProps[];
  progressById: Record<string, number>;
  title?: string;
}

const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  movies,
  progressById,
  title = "Continue Watching",
}) => {
  const [hovered, setHovered] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { itemWidthPercentage, visibleItems } = useDynamicLayout();
  const { activeProfile } = useProfile();
  const columns = visibleItems > 0 ? visibleItems : 4;

  const handleRemoveMovie = (movie: MovieProps) => {
    if (!activeProfile) return;
    removeWatchProgress(activeProfile.id, {
      id: String(movie.id),
      type: movie.type,
    });
  };

  if (movies.length === 0) return null;

  const getTrackViewportWidth = (element: HTMLDivElement) => {
    const computedStyles = window.getComputedStyle(element);
    const paddingLeft = parseFloat(computedStyles.paddingLeft || "0");
    const paddingRight = parseFloat(computedStyles.paddingRight || "0");
    return Math.max(1, element.clientWidth - paddingLeft - paddingRight);
  };

  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const maxStartIndex = Math.max(0, movies.length - columns);
    const targetIdx =
      direction === "left"
        ? Math.max(0, currentIdx - columns)
        : Math.min(currentIdx + columns, maxStartIndex);

    const pageWidth = getTrackViewportWidth(scrollRef.current);
    const itemWidth = pageWidth / columns;
    scrollRef.current.scrollTo({ left: targetIdx * itemWidth, behavior: "smooth" });
    setCurrentIdx(targetIdx);
  };

  return (
    <section className="my-[4vmin]">
      <Wrapper>
        <h2 className="text-h2 mt-0 mb-[0.35em]">{title}</h2>
      </Wrapper>

      <div
        className="m-0 relative touch-action-pan-y"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {movies.length > columns && (
          <PaginationIndicator
            totalItems={movies.length}
            visibleItems={columns}
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
            gridTemplateColumns: `repeat(${columns}, minmax(${itemWidthPercentage}, 1fr))`,
            gridAutoColumns: `minmax(${itemWidthPercentage}, 1fr)`,
          }}
          tabIndex={-1}
        >
          {movies.map((movie) => {
            const progress = Math.round(
              (progressById[String(movie.id)] ?? 0) * 100
            );

            return (
              <div key={movie.id} className="relative">
                <MovieCard
                  movie={movie}
                  progressPercent={progress}
                  onRemove={handleRemoveMovie}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scrollToDirection("right")}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-30 rounded-r-md transition-opacity duration-200 shadow-md"
          style={{ width: "4%" }}
          tabIndex={currentIdx + columns < movies.length ? 0 : -1}
        >
          {currentIdx + columns < movies.length && (
            <span className="bg-brand-overlaySoft w-full h-full flex items-center justify-center hover:bg-brand-overlaySubtle">
              {hovered && <RightArrowIcon />}
            </span>
          )}
        </button>
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
