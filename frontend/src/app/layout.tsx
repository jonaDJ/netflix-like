import type { Metadata } from "next";
import ConditionalNavigation from "../components/layout/ConditionalNavigation";
import "./globals.css";
import { DynamicLayoutProvider } from "../components/contexts/DynamicLayoutContext";

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
          {children}
        </DynamicLayoutProvider>
      </body>
    </html>
  );
}
