import React from "react";

interface IconProps {
  className?: string; // Allow className to pass dynamic classes
}

const ExpressIcon: React.FC<IconProps> = ({ className = "w-24 h-24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1333.33 773.55"
    className={className}
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
  >
    <path
      d="M1333.33 753.49c-48.5 12.33-78.5.54-105.41-39.87L1036.5 448.79l-27.67-36.67L785.29 714.5c-25.54 36.38-52.33 52.2-100 39.33l286.25-384.25-266.5-347.09c45.83-8.91 77.5-4.38 105.62 36.67l198.54 268.13 200-266.67c25.62-36.38 53.17-50.2 99.17-36.8l-103.33 137-140 182.29c-16.67 20.83-14.38 35.09.96 55.2l267.33 355.18zM.34 363.16l23.41-115.17c63.75-227.92 325-322.63 505.17-181.8 105.29 82.83 131.46 200 126.25 331.25H61.67C52.76 633.69 222.8 776.27 439.58 703.53c76.04-25.54 120.83-85.09 143.25-159.58 11.38-37.33 30.2-43.17 65.29-32.5-17.91 93.17-58.33 171-143.75 219.71-127.62 72.91-309.8 49.33-405.62-52C41.66 620.36 18.08 545.87 7.5 466.2c-1.67-13.17-5-25.71-7.5-38.33.22-21.56.34-43.11.34-64.67v-.04zm62.41-15.83h536.33c-3.5-170.83-109.87-292.17-255.25-293.2-159.58-1.25-274.17 117.2-281.09 293.2h.01z"
      fillRule="nonzero"
    />
  </svg>
);

const GraphQLIcon: React.FC<IconProps> = ({ className = "w-24 h-24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="m50 6.903 37.323 21.549v43.096L50 93.097 12.677 71.548V28.451zM16.865 30.87v31.656L44.28 15.041zM50 13.51 18.398 68.246h63.205zm27.415 58.924h-54.83L50 88.261zm5.72-9.908L55.72 15.041 83.136 30.87z"
      clipRule="evenodd"
    />
    <circle cx="50" cy="9.321" r="8.82" />
    <circle cx="85.229" cy="29.66" r="8.82" />
    <circle cx="85.229" cy="70.34" r="8.82" />
    <circle cx="50" cy="90.679" r="8.82" />
    <circle cx="14.766" cy="70.34" r="8.82" />
    <circle cx="14.766" cy="29.66" r="8.82" />
  </svg>
);

// React Icon
const ReactIcon: React.FC<IconProps> = ({ className = "w-24 h-24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-10.5 -9.45 21 18.9"
    className={className}
  >
    <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="10" ry="4.5"></ellipse>
      <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
      <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
    </g>
  </svg>
);

// Next.js Icon
const NextIcon: React.FC<IconProps> = ({ className = "w-24 h-24" }) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    className={className}
  >
    <g transform="translate(.722 .64) scale(6.375)">
      <circle cx="40" cy="40" r="40" />
      <path
        d="M66.448 70.009L30.73 24H24v31.987h5.384v-25.15l32.838 42.427a40.116 40.116 0 004.226-3.255z"
        fill="url(#prefix___Linear1)"
        fillRule="nonzero"
      />
      <path fill="url(#prefix___Linear2)" d="M51.111 24h5.333v32h-5.333z" />
    </g>
    <defs>
      <linearGradient
        id="prefix___Linear1"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(51.103 -29.93 76.555) scale(25.1269)"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="prefix___Linear2"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(90.218 14.934 38.787) scale(23.50017)"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export { GraphQLIcon, ReactIcon, NextIcon, ExpressIcon };
