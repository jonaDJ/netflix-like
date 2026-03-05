import type { Metadata } from "next";
import ConditionalNavigation from "../components/layout/ConditionalNavigation";
import "./globals.css";
import { DynamicLayoutProvider } from "../components/contexts/DynamicLayoutContext";
import MovieModalWrapper from "src/components/ui/MovieModalWrapper";
import Footer from "src/components/layout/Footer";
import { Suspense } from "react";
import { Bebas_Neue, Manrope } from "next/font/google";
import { ProfileProvider } from "../components/contexts/ProfileContext";
import ProfilePickerOverlay from "../components/layout/ProfilePickerOverlay";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${displayFont.variable} ${bodyFont.variable} antialiased`}
      >
        <ProfileProvider>
          <ProfilePickerOverlay />
          <DynamicLayoutProvider>
            <ConditionalNavigation />
            <Suspense fallback={<div>Loading...</div>}>
              <MovieModalWrapper>{children}</MovieModalWrapper>
            </Suspense>
            <Footer />
          </DynamicLayoutProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
