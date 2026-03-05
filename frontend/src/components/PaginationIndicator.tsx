import React, { useMemo, memo } from "react";

interface PaginationIndicatorProps {
  totalItems: number;
  visibleItems: number;
  currentIdx: number;
}

const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  totalItems,
  visibleItems,
  currentIdx,
}) => {
  const safeVisibleItems = Math.max(1, visibleItems);
  const totalPages = Math.ceil(totalItems / safeVisibleItems);
  const maxDots = Math.min(6, totalPages);

  const activePage = useMemo(
    () => Math.min(Math.floor(currentIdx / safeVisibleItems), totalPages - 1),
    [currentIdx, safeVisibleItems, totalPages]
  );

  const dotWindowStart = useMemo(() => {
    if (totalPages <= maxDots) return 0;

    const centeredStart = activePage - Math.floor(maxDots / 2);
    return Math.min(Math.max(0, centeredStart), totalPages - maxDots);
  }, [activePage, maxDots, totalPages]);

  const visiblePages = useMemo(
    () => Array.from({ length: maxDots }, (_, index) => dotWindowStart + index),
    [dotWindowStart, maxDots]
  );

  return (
    <ul className="flex space-x-1 -top-4 absolute right-[4%]">
      {visiblePages.map((pageIndex) => (
        <li
          key={pageIndex}
          className={`h-0.5 w-3  ${
            activePage === pageIndex
              ? "bg-brand-text"
              : "bg-brand-indicatorIdle"
          }`}
        ></li>
      ))}
    </ul>
  );
};

export default memo(PaginationIndicator);
