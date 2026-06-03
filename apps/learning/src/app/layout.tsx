import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidCenter · Học tập & Sinh hoạt",
  description:
    "Quản lý hoạt động học tập và lịch sinh hoạt hằng ngày cho bé.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
