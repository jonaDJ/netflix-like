"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchIcon } from "./icons/Icons";

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

  return (
    <div className="flex items-center space-x-4 ">
      <div className="relative">
        <div
          className={`relative flex items-center overflow-hidden transition-all duration-300 rounded-full ${
            showSearch ? "bg-gray-600" : "bg-transparent"
          }`}
          style={{ width: showSearch ? "10rem" : "2rem" }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onBlur={() => setShowSearch(false)}
            className="bg-transparent text-white rounded-full focus:outline-none transition-all duration-300 pl-2 pr-2 py-1 w-full"
            style={{
              width: showSearch ? "10rem" : "0rem",
              paddingLeft: showSearch ? "2.5rem" : "0rem",
            }}
            onChange={handleSearchChange}
          />
        </div>
        <button
          onClick={clickHandler}
          className="absolute inset-y-0 left-0 flex items-center pl-3 focus:outline-none"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
