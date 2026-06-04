import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Quest",
  robots: { index: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
