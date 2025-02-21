"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface DynamicLayoutContextProps {
  itemWidth: string;
  visibleItems: number;
}

const DynamicLayoutContext = createContext<DynamicLayoutContextProps>({
  itemWidth: "25%",
  visibleItems: 0,
});

export const DynamicLayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itemWidth, setItemWidth] = useState("25%");
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const updateItemWidth = () => {
      if (typeof window !== "undefined") {
        const viewportWidth = window.innerWidth;
        const numberOfItems = Math.max(Math.floor(viewportWidth / 200), 3);
        const calculatedWidth = `${(100 / numberOfItems).toFixed(2)}%`;

        setVisibleItems(numberOfItems);
        setItemWidth(calculatedWidth);
      }
    };

    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, []);

  return (
    <DynamicLayoutContext.Provider value={{ itemWidth, visibleItems }}>
      {children}
    </DynamicLayoutContext.Provider>
  );
};

export const useDynamicLayout = () => useContext(DynamicLayoutContext);
