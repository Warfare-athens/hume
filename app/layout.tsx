import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "HUME Perfumes | Luxury Inspired Fragrances - Dior, Chanel, Tom Ford & More",
    template: "%s | HUME Perfumes",
  },
  description:
    "Discover HUME Perfumes - premium inspired fragrances crafted to capture the essence of iconic designer scents. Affordable luxury alternatives to Dior, Chanel, Tom Ford, Creed, YSL, Gucci & more. Free shipping over INR 75.",
  keywords: [
    "inspired perfumes",
    "clone perfumes",
    "designer fragrance alternatives",
    "affordable luxury perfume",
    "perfume dupes UK",
    "HUME perfumes",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "HUME Perfumes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



