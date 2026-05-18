import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/client/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlogSpace",
  description: "A simple place to publish ideas and stories."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="premium-shell">
            <div className="mesh-grid pointer-events-none fixed inset-0 z-0" />
            <Navbar />
            <div className="relative z-10">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
