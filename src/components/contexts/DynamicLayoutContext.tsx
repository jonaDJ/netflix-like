"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface DynamicLayoutContextProps {
  itemWidthPercentage: string;
  itemWidth: number;
  visibleItems: number;
}

const DynamicLayoutContext = createContext<DynamicLayoutContextProps>({
  itemWidthPercentage: "25%",
  itemWidth: 0,
  visibleItems: 0,
});

export const DynamicLayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itemWidthPercentage, setItemWidthPercentage] = useState("25%");
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const updateItemWidth = () => {
      if (typeof window !== "undefined") {
        const viewportWidth = window.innerWidth;
        const numberOfItems = Math.max(Math.floor(viewportWidth / 200), 3);
        const calculatedPercentage = (100 / numberOfItems).toFixed(2);
        const calculatedPixelWidth = viewportWidth / numberOfItems;

        setVisibleItems(numberOfItems);
        setItemWidthPercentage(`${calculatedPercentage}%`);
        setItemWidth(calculatedPixelWidth);
      }
    };

    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, []);

  return (
    <DynamicLayoutContext.Provider
      value={{ itemWidthPercentage, itemWidth, visibleItems }}
    >
      {children}
    </DynamicLayoutContext.Provider>
  );
};

export const useDynamicLayout = () => useContext(DynamicLayoutContext);
