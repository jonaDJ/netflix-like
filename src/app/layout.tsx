import type { Metadata } from "next";
import ConditionalNavigation from "@/components/layout/ConditionalNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netflix-Like",
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
