"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Wrapper from "./Wrapper";
import SearchBar from "../SearchBar";
import { usePathname } from "next/navigation";

const navItems = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "My List", href: "/my-list" },
];

const navItemsList = (pathName: string) =>
  navItems.map((item) => (
    <li key={item.id}>
      <Link href={item.href}>
        <div
          className={`text-list hover:text-gray-300 ${
            pathName === item.href ? "font-bold" : ""
          }`}
        >
          {item.name}
        </div>
      </Link>
    </li>
  ));

const NavigationBar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const pathName = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.classList.add("bg-black");
        } else {
          navRef.current.classList.remove("bg-black");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-colors duration-300 py-2 md:py-3 "
    >
      <Wrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="text-button text-red-600 font-extrabold">
                NETFLIX-LIKE
              </div>
            </Link>

            <ul className="hidden md:flex space-x-4">
              {navItemsList(pathName)}
            </ul>

            <div className="md:hidden relative group">
              <button className="text-button hover:text-gray-300 focus:outline-none">
                Browse
              </button>
              <div className="absolute hidden group-hover:block top-full left-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded shadow-lg">
                <ul className="flex flex-col gap-4 items-center py-2">
                  {navItemsList(pathName)}
                </ul>
              </div>
            </div>
          </div>

          <SearchBar />
        </div>
      </Wrapper>
    </nav>
  );
};

export default NavigationBar;
