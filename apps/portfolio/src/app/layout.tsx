import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidCenter · Portfolio của bé",
  description:
    "Hồ sơ năng lực của bé — thành tích, dự án và hoạt động để apply các chương trình học.",
};

const noFlash = `try{var l=localStorage.getItem('locale');if(l)document.documentElement.dataset.locale=l;}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-locale="vi" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
