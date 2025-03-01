import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-950 text-white px-6 flex flex-row-reverse justify-between items-center mt-auto">
      <div className="border-t-2 py-0.5">
        <div className="flex flex-wrap justify-center space-x-6 items-center">
          <a
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transform transition duration-300 hover:scale-110"
          >
            <div className="p-1 border border-white rounded-full">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                alt="React Logo"
                width={30}
                height={30}
                style={{ aspectRatio: "1/1" }}
              />
            </div>
          </a>
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="transform transition duration-300 hover:scale-110"
          >
            <div className="p-2 border bg-red-50 border-white rounded-full">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg"
                alt="Next.js Logo"
                width={40}
                height={40}
                style={{ aspectRatio: "1/1" }}
              />
            </div>
          </a>
          <a
            href="https://graphql.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transform transition duration-300 hover:scale-110"
          >
            <div className="p-1 border border-white rounded-full">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg"
                alt="GraphQL Logo"
                width={30}
                height={30}
                style={{ aspectRatio: "1/1" }}
              />
            </div>
          </a>
          <a
            href="https://expressjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transform transition duration-300 hover:scale-110"
          >
            <div className="p-1 bg-white border border-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width={30}
                height={30}
                viewBox="0 0 50 50"
              >
                <path d="M49.729 11h-.85c-1.051 0-2.041.49-2.68 1.324l-8.7 11.377-8.7-11.377C28.162 11.49 27.171 11 26.121 11h-.85l10.971 14.346L25.036 40h.85c1.051 0 2.041-.49 2.679-1.324L37.5 26.992l8.935 11.684C47.073 39.51 48.063 40 49.114 40h.85L38.758 25.346 49.729 11zM21.289 34.242c-2.554 3.881-7.582 5.87-12.389 4.116C4.671 36.815 2 32.611 2 28.109L2 27h12v0h11l0-4.134c0-6.505-4.818-12.2-11.295-12.809C6.273 9.358 0 15.21 0 22.5l0 5.573c0 5.371 3.215 10.364 8.269 12.183 6.603 2.376 13.548-1.17 15.896-7.256 0 0 0 0 0 0h-.638C22.616 33 21.789 33.481 21.289 34.242zM2 22.5C2 16.71 6.71 12 12.5 12S23 16.71 23 22.5V25H2V22.5z"></path>
              </svg>
            </div>
          </a>
        </div>
      </div>
      <div className="text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Your Netflix Clone. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
