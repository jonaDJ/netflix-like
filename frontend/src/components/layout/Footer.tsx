"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "../contexts/ProfileContext";

interface SocialLink {
  label: string;
  href: string;
  path: string;
}

const SocialIcon: React.FC<{ path: string }> = ({ path }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d={path} />
  </svg>
);

const Footer: React.FC = () => {
  const pathname = usePathname();
  const { activeProfile, isProfilePickerOpen } = useProfile();
  const githubProfileHref = "https://github.com/jonaDJ/";
  const githubRepoHref = "https://github.com/jonaDJ/netflix-like";

  if (pathname.startsWith("/watch") || !activeProfile || isProfilePickerOpen) {
    return null;
  }

  const socialLinks: SocialLink[] = [
    {
      label: "Contact",
      href: githubProfileHref,
      path: "M19 3A2.999 2.999 0 0 1 22 6v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h14Zm-9.5 7H6.75V18H9.5v-8Zm6.75 0c-1.31 0-2.11.72-2.46 1.22V10H11v8h2.75v-4.12c0-1.09.22-2.14 1.56-2.14 1.33 0 1.34 1.24 1.34 2.22V18h2.75v-4.6c0-2.26-.48-3.4-2.95-3.4ZM8.12 6A1.62 1.62 0 1 0 8.13 9.24 1.62 1.62 0 0 0 8.12 6Z",
    },
    {
      label: "GitHub",
      href: githubRepoHref,
      path: "M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.41-4.04-1.41-.55-1.37-1.33-1.73-1.33-1.73-1.08-.73.08-.72.08-.72 1.2.08 1.82 1.2 1.82 1.2 1.06 1.82 2.79 1.3 3.47 1 .11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.53.12-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.55 3.28-1.23 3.28-1.23.66 1.67.25 2.9.13 3.2.77.84 1.23 1.92 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.23v3.31c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z",
    },
    {
      label: "Contribution",
      href: githubRepoHref,
      path: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 4v2h3v6h2v-6h3V9H6Zm10 0v8h2v-8h-2Z",
    },
  ];

  return (
    <footer className="mt-20 bg-brand-bg text-[#757575]">
      <div className="mx-auto w-full max-w-[1000px] px-[6%] pb-10 pt-3">
        <div className="mb-5 flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#757575]/60 transition-colors hover:border-brand-text hover:text-brand-text"
            >
              <SocialIcon path={social.path} />
            </a>
          ))}
        </div>

        <p className="mb-5 text-sm">Contact and contribution links</p>

        <nav
          className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] sm:grid-cols-4"
          aria-label="Footer links"
        >
          <a
            href={githubProfileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text hover:underline"
          >
            Contact
          </a>
          <a
            href={githubRepoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text hover:underline"
          >
            Contribution
          </a>
          <a
            href={githubRepoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text hover:underline"
          >
            Git
          </a>
          <a
            href={githubRepoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text hover:underline"
          >
            Service Code
          </a>
        </nav>

        <p className="mt-6 text-xs">
          Netflix-like clone | Profile: {activeProfile.name} | dev 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
