import type { Metadata } from "next";
import "./globals.css";

const TITLE = "Đào Đình Hữu (Tin) · Hồ sơ năng lực";
const DESC =
  "Hồ sơ năng lực của Đào Đình Hữu (Tin), 10 tuổi — nhiều huy chương Olympic Khoa học Quốc gia & Quốc tế, Học sinh Xuất sắc 4 năm liền, đam mê vẽ và hướng tới Science Illustration.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.huudaodinh.site"),
  title: TITLE,
  description: DESC,
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESC,
    url: "/",
    siteName: "Hồ sơ năng lực · Đào Đình Hữu (Tin)",
    locale: "vi_VN",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Đào Đình Hữu (Tin)" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  icons: { icon: "/media/avatar.jpg" },
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
