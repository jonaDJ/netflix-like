import React from "react";
import Link from "next/link"; // Import Link from Next.js
import {
  ExpressIcon,
  GraphQLIcon,
  NextIcon,
  ReactIcon,
} from "../icons/FooterIcons";

const Footer: React.FC = () => {
  const icons = [
    {
      id: "express",
      icon: <ExpressIcon />,
      color: "fill-white",
      href: "https://expressjs.com/",
    },
    {
      id: "graphql",
      icon: <GraphQLIcon />,
      color: "fill-[#E10098]",
      href: "https://graphql.org/",
    },
    {
      id: "react",
      icon: <ReactIcon />,
      color: "fill-[#61DAFB]",
      href: "https://react.dev/",
    },
    {
      id: "next",
      icon: <NextIcon />,
      color: "fill-gray-950",
      href: "https://nextjs.org/",
    },
  ];

  return (
    <footer className="bg-bgBlack  bottom-white bottom-2 text-white px-6 py-4 flex justify-between mt-auto">
      <div className="flex flex-wrap justify-center space-x-6 items-center">
        {icons.map((icon) => (
          <Link
            id={icon.id}
            key={icon.id}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Link to ${icon.id} documentation`}
            className="cursor-pointer"
          >
            {React.cloneElement(icon.icon, {
              className: `${icon.color} w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-110 transition-transform duration-300`,
            })}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap justify-center space-x-6 items-center"></div>

      <div className="text-sm text-gray-400 flex items-center">
        <p className="mr-6">
          <a
            href={process.env.GIT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
            aria-label="Link to LinkedIn profile"
          >
            LinkedIn
          </a>
        </p>
        <p>
          <a
            href={process.env.LINKEDIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
            aria-label="Link to Git repository"
          >
            Git
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
