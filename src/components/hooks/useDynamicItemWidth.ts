import { useState, useEffect, useRef } from "react";

export function useDynamicItemWidth() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [itemWidth, setItemWidth] = useState("25%");
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
  return { scrollRef, itemWidth };
}

export default useDynamicItemWidth;
