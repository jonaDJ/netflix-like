import React from "react";

const ShimmerUI = () => {
  const placeholderCount = 6;

  return (
    <section className="my-[3vmin] py-6">
      {/* Shimmer Title */}
      <div className="px-4">
        <div className="h-8 w-1/3 bg-gray-800 rounded mb-4 animate-pulse" />
      </div>

      {/* Shimmer Movie Cards */}
      <div className="relative">
        <div className="px-[4%] grid grid-flow-col gap-4 overflow-x-auto hide-scrollbar">
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[200px]">
              <div className="relative w-full aspect-[4/2.5] bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShimmerUI;
