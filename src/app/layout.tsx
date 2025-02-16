import type { Metadata } from "next";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streaming Platform",
  description: "Your ultimate movie streaming experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalNavigation />
        {children}
      </body>
    </html>
  );
}
