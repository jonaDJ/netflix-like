"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CloseIcon, SearchIcon } from "./icons/Icons";

const SearchBar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/search") {
      setShowSearch(true);
      setSearchTerm(searchParams.get("q") || "");
    }
  }, [pathname, searchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        router.push(`/search?q=${encodeURIComponent(value)}`);
      } else {
        router.push("/");
      }
    }, 500);
  };

  const clickHandler = () => {
    setShowSearch(true);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setShowSearch(false);
    setSearchTerm("");
    router.push("/");
  };

  return (
    <div className="flex items-center space-x-4 ">
      <div className="relative">
        <div
          className={`relative flex items-center overflow-hidden transition-all duration-300 ${
            showSearch ? "border border-white bg-transparent" : "bg-transparent"
          }`}
          style={{ width: showSearch ? "12rem" : "2rem" }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onBlur={() => {
              if (!searchTerm) setShowSearch(false);
            }}
            className="bg-transparent text-white focus:outline-none transition-all duration-300 pl-2 pr-2 py-1 w-full"
            style={{
              width: showSearch ? "10rem" : "0rem",
              paddingLeft: showSearch ? "2.5rem" : "0rem",
            }}
            tabIndex={showSearch ? 0 : -1}
            onChange={handleSearchChange}
          />
          {showSearch && (
            <button
              onClick={handleClose}
              className="absolute right-2 text-white"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <button
          tabIndex={showSearch ? -1 : 0}
          onClick={clickHandler}
          className="absolute w-10 pl-0 inset-y-0 left-0 flex items-center focus:ring-white"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
