import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers";

// Internal tool — keep it out of search indexes even if ever hosted.
export const metadata: Metadata = {
  title: "Đào Đình Hữu — Đánh giá nội bộ (Lớp 1 → Lớp 4)",
  description: "Bảng tổng hợp & đánh giá tiến bộ học tập nội bộ.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-cream text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
