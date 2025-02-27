import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        bgBlack: "var(--bg-color)",
      },
      backgroundColor: {
        "custom-gray-800": "rgba(31, 41, 55, 0.8)",
        "custom-gray-700": "rgba(55, 65, 81, 0.8)",
      },
    },
  },
  plugins: [],
} satisfies Config;
