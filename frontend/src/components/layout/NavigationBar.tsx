"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Wrapper from "../ui/Wrapper";
import SearchBar from "../SearchBar";
import { usePathname } from "next/navigation";
import { DropdownIcon, DropUpIcon } from "../icons/Icons";
import { useProfile } from "../contexts/ProfileContext";

const navItems = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "New & Popular", href: "/latest" },
  { id: 3, name: "My List", href: "/my-list" },
];

const navItemsList = (pathName: string) =>
  navItems.map((item) => (
    <li key={item.id} className="text-nav">
      <Link href={item.href}>
        <div
          className={`text-nav h-12 flex justify-center items-center hover:text-brand-text ${
            pathName === item.href ? "active" : ""
          }`}
        >
          {item.name}
        </div>
      </Link>
    </li>
  ));

const NavigationBar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { activeProfile, isKidsMode, openProfilePicker } = useProfile();
  const isGuestMode = activeProfile?.name.toLowerCase() === "guest";
  const modeLabel = isKidsMode
    ? "Kids Mode"
    : isGuestMode
      ? "Guest Mode"
      : "Personal Mode";

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (!activeProfile) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 py-2 md:py-3 ${
        scrolled ? "bg-brand-bg" : ""
      }`}
    >
      <Wrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="font-display text-[1.15rem] leading-none tracking-[0.18em] text-brand-accent md:text-[1.4rem]">
                NETFLIX-LIKE
              </div>
            </Link>

            <ul className="hidden md:flex space-x-4">
              {navItemsList(pathName)}
            </ul>
            {isKidsMode && (
              <span className="hidden md:inline text-meta tracking-[0.18em] text-brand-text">
                KIDS
              </span>
            )}
            {isGuestMode && (
              <span className="hidden md:inline text-meta tracking-[0.16em] text-brand-text">
                GUEST
              </span>
            )}

            <div className="md:hidden relative group">
              <button className="flex items-center text-nav hover:text-brand-text">
                <span>Browse</span>
                <DropdownIcon className="ml-1 w-5 h-5 hover:text-brand-text" />
              </button>

              <div className="absolute hidden group-hover:block top-full border-t-2 border-t-brand-text left-2 -translate-x-1/3 mt-2 w-64 bg-brand-bg border border-brand-border rounded shadow-lg">
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                  <DropUpIcon className="w-6 h-5 text-brand-text" />
                </div>
                <ul className="flex flex-col items-center py-2">
                  {navItemsList(pathName)}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <SearchBar />
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded px-1 py-1 hover:bg-brand-overlaySubtle"
                aria-label="Open account menu"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded text-sm font-bold text-brand-text"
                  style={{ backgroundColor: activeProfile.avatarColor }}
                >
                  {activeProfile.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden md:inline text-meta text-brand-text">
                  {activeProfile.name}
                </span>
                {(isKidsMode || isGuestMode) && (
                  <span className="hidden lg:inline text-[0.68rem] uppercase tracking-[0.12em] text-brand-textMuted">
                    {modeLabel}
                  </span>
                )}
                <DropdownIcon className="h-4 w-4 text-brand-text" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded border border-brand-border bg-brand-surface p-2 shadow-lg">
                  <div className="px-2 py-2 text-meta text-brand-text">
                    Profile: {activeProfile.name}
                  </div>
                  <div className="px-2 pb-2 text-[0.72rem] uppercase tracking-[0.12em] text-brand-textMuted">
                    {modeLabel}
                  </div>
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      openProfilePicker();
                    }}
                    className="w-full rounded px-2 py-2 text-left text-meta text-brand-text hover:bg-brand-overlaySubtle"
                  >
                    Switch Profiles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </nav>
  );
};

export default NavigationBar;
