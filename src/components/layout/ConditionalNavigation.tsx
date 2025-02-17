"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "./NavigationBar";

const ConditionalNavigation: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/watch")) {
    return null;
  }

  return <NavigationBar />;
};

export default ConditionalNavigation;
