"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "./NavigationBar";
import { useProfile } from "../contexts/ProfileContext";

const ConditionalNavigation: React.FC = () => {
  const pathname = usePathname();
  const { activeProfile, isProfilePickerOpen } = useProfile();

  if (pathname.startsWith("/watch") || !activeProfile || isProfilePickerOpen) {
    return null;
  }

  return <NavigationBar />;
};

export default ConditionalNavigation;
