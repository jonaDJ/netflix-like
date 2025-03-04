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
  const totalPages = Math.ceil(totalItems / visibleItems);

  const activePage = useMemo(
    () => Math.min(Math.ceil(currentIdx / visibleItems), totalPages - 1),
    [currentIdx, visibleItems, totalPages]
  );

  return (
    <ul className="flex space-x-1 -top-4 absolute right-[4%]">
      {Array.from({ length: totalPages }).map((_, index) => (
        <li
          key={index}
          className={`h-0.5 w-3  ${
            activePage === index ? "bg-white" : "bg-gray-700"
          }`}
        ></li>
      ))}
    </ul>
  );
};

export default memo(PaginationIndicator);
