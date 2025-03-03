import type { Metadata } from "next";
import ConditionalNavigation from "../components/layout/ConditionalNavigation";
import "./globals.css";
import { DynamicLayoutProvider } from "../components/contexts/DynamicLayoutContext";
import MovieModalWrapper from "src/components/ui/MovieModalWrapper";
import Footer from "src/components/layout/Footer";
import { Suspense } from "react";

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
        <DynamicLayoutProvider>
          <ConditionalNavigation />
          <Suspense fallback={<div>Loading...</div>}>
            <MovieModalWrapper>{children}</MovieModalWrapper>
          </Suspense>
          <Footer />
        </DynamicLayoutProvider>
      </body>
    </html>
  );
}
