import React from "react";

interface ShimmerUIProps {
  variant?: "rows" | "grid";
  withNavOffset?: boolean;
}

const ShimmerUI: React.FC<ShimmerUIProps> = ({
  variant = "rows",
  withNavOffset = false,
}) => {
  const placeholderCount = variant === "grid" ? 12 : 6;
  const offsetClass = withNavOffset ? "pt-[100px]" : "pt-10";

  return (
    <section className={`${offsetClass} min-h-screen bg-brand-bg`}>
      {variant === "grid" ? (
        <div className="px-4 md:px-8">
          <div className="h-8 w-56 bg-brand-elevated rounded mb-8 animate-pulse" />
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div key={index} className="relative w-full aspect-[4/2.5]">
                <div className="absolute inset-0 bg-brand-elevated rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="my-[4vmin]">
          <div className="px-[4%]">
            <div className="h-8 w-1/3 bg-brand-elevated rounded mb-4 animate-pulse" />
          </div>
          <div className="relative">
            <div className="px-[4%] grid grid-flow-col gap-4 overflow-x-auto hide-scrollbar">
              {Array.from({ length: placeholderCount }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[200px]">
                  <div className="relative w-full aspect-[4/2.5] bg-brand-elevated rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShimmerUI;
