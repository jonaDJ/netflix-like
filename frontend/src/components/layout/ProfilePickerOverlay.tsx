"use client";

import React from "react";
import { useProfile } from "../contexts/ProfileContext";
import { isProfileSelectable } from "../../utils/profileStorage";

const ProfilePickerOverlay: React.FC = () => {
  const {
    profiles,
    activeProfile,
    isProfilePickerOpen,
    selectProfile,
    closeProfilePicker,
  } = useProfile();

  if (!isProfilePickerOpen) return null;

  const getModeLabel = (name: string, isKids: boolean) => {
    if (isKids) return "Kids Mode";
    if (name.toLowerCase() === "guest") return "Guest Mode";
    return "Personal";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-10">
        <h1 className="text-h2 text-brand-text">Who&apos;s watching?</h1>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-3">
          {profiles.map((profile) => {
            const isSelectable = isProfileSelectable(profile);
            const isActive = activeProfile?.id === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => selectProfile(profile.id)}
                disabled={!isSelectable}
                className={`flex flex-col items-center gap-3 rounded-md p-3 transition ${
                  !isSelectable
                    ? "opacity-45 cursor-not-allowed bg-brand-overlaySubtle"
                    : ""
                } ${
                  isActive
                    ? "bg-brand-overlaySoft ring-1 ring-brand-textMuted"
                    : "hover:bg-brand-overlaySubtle"
                }`}
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-md text-2xl font-bold text-brand-text"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="text-p text-brand-text">
                  {profile.name}
                </div>
                <div className="text-[0.72rem] uppercase tracking-[0.12em] text-brand-textMuted">
                  {getModeLabel(profile.name, profile.isKids)}
                </div>
                {!isSelectable && (
                  <div className="text-[0.65rem] uppercase tracking-[0.12em] text-brand-textMuted">
                    Disabled
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {activeProfile && (
          <button
            onClick={closeProfilePicker}
            className="mt-10 rounded border border-brand-border px-5 py-2 text-meta text-brand-text hover:bg-brand-overlaySubtle"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePickerOverlay;
