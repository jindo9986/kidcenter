import type { Metadata } from "next";
import "./globals.css";

const TITLE = "Đào Đình Hữu (Tin)";
const DESC =
  "A curious 10-year-old who loves science, maths and art — exploring where logic meets drawing in science illustration.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.huudaodinh.site"),
  title: TITLE,
  description: DESC,
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESC,
    url: "/",
    siteName: "Đào Đình Hữu (Tin)",
    locale: "en_US",
    alternateLocale: "vi_VN",
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
