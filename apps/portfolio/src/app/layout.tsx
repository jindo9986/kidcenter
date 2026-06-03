import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidCenter · Portfolio của bé",
  description:
    "Hồ sơ năng lực của bé — thành tích, dự án và hoạt động để apply các chương trình học.",
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
