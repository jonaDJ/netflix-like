"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  APP_PROFILES,
  isProfileSelectable,
  PRIMARY_PROFILE_ID,
  UserProfile,
} from "../../utils/profileStorage";

interface ProfileContextValue {
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  isKidsMode: boolean;
  isProfilePickerOpen: boolean;
  selectProfile: (profileId: string) => void;
  openProfilePicker: () => void;
  closeProfilePicker: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profiles] = useState<UserProfile[]>(APP_PROFILES);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(
    PRIMARY_PROFILE_ID
  );
  const [isProfilePickerOpen, setIsProfilePickerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("profiles");
      localStorage.removeItem("active-profile-id");
    }
  }, []);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? null,
    [profiles, activeProfileId]
  );

  const selectProfile = (profileId: string) => {
    const selectedProfile = profiles.find((p) => p.id === profileId);
    if (!selectedProfile || !isProfileSelectable(selectedProfile)) {
      return;
    }

    setActiveProfileIdState(selectedProfile.id);
    setIsProfilePickerOpen(false);
  };

  const openProfilePicker = () => setIsProfilePickerOpen(true);
  const closeProfilePicker = () => {
    if (activeProfileId) {
      setIsProfilePickerOpen(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        isKidsMode: Boolean(activeProfile?.isKids),
        isProfilePickerOpen,
        selectProfile,
        openProfilePicker,
        closeProfilePicker,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextValue => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
