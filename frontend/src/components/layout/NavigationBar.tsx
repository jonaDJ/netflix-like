"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Wrapper from "../ui/Wrapper";
import SearchBar from "../SearchBar";
import { usePathname } from "next/navigation";
import { DropdownIcon, DropUpIcon } from "../icons/Icons";

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
          className={`text-nav h-12 flex justify-center items-center hover:text-gray-300 ${
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
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 py-2 md:py-3 ${
        scrolled ? "bg-black" : ""
      }`}
    >
      <Wrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="text-xs text-red-600 font-bold">NETFLIX-LIKE</div>
            </Link>

            <ul className="hidden md:flex space-x-4">
              {navItemsList(pathName)}
            </ul>

            <div className="md:hidden relative group">
              <button className="flex items-center text-nav hover:text-gray-300">
                <span>Browse</span>
                <DropdownIcon className="ml-1 w-5 h-5  hover:text-gray-300" />
              </button>

              <div className="absolute hidden group-hover:block top-full border-t-2 border-t-white left-2 -translate-x-1/3 mt-2 w-64 bg-black border border-gray-700 rounded shadow-lg">
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                  <DropUpIcon className="w-6 h-5 text-white" />
                </div>
                <ul className="flex flex-col items-center py-2">
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
