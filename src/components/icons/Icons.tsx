import React from "react";

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
    />
  </svg>
);

export const DownArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-5 h-5 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 1 14 4.5"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
    />
  </svg>
);

export const LeftArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export const RightArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export const UpArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 8"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
    />
  </svg>
);

export const VideoPlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M3 2v12l10-6L3 2z" />
  </svg>
);

export const PlayIcon: React.FC<{ dark: boolean }> = ({ dark }) => (
  <svg
    className={`w-4 h-4 ${dark ? "text-gray-800" : "text-white"}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 8 16"
  >
    <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z" />
  </svg>
);

export const BackIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className={`w-6 h-6 lg:w-8 lg:h-8 text-gray-800 dark:text-white`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 5H1m0 0 5 5M1 5l5-5"
    />
  </svg>
);

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-5 h-5 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M5 2h2v12H5V2zm4 0h2v12H9V2z" />
  </svg>
);

export const VolumeIcon: React.FC = () => (
  <svg
    className="w-6 h-6 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 5L6 9H2v6h4l5 4V5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 9a5 5 0 010 6M18 6a9 9 0 010 12"
    />
  </svg>
);

export const MuteIcon: React.FC = () => (
  <svg
    className="w-6 h-6 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 5L6 9H2v6h4l5 4V5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 9l4 4m0-4l-4 4"
    />
  </svg>
);

export const ForwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 lg:w-8 lg:h-8 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M4 2v12l8-6-8-6zm6 0v12l8-6-8-6z" />
  </svg>
);

export const RewindIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 lg:w-8 lg:h-8 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M10 2v12L2 8l8-6zm4 0v12l-8-6 8-6z" />
  </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18 17.94 6M18 18 6.06 6"
    />
  </svg>
);

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 11.917 9.724 16.5 19 7.5"
    />
  </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h14m-7 7V5"
    />
  </svg>
);
