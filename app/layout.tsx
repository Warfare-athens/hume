import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import EarlyBirdPopup from "@/components/EarlyBirdPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HUME Fragrance | Premium Inspired Perfumes in India | Shop Now",
    template: "%s | HUME Perfumes",
  },
  description:
    "Discover HUME Perfumes - premium fragrance interpretations crafted to celebrate iconic scent profiles with refined quality and modern luxury. Free shipping over INR 75.",
  keywords: [
    "luxury fragrances",
    "modern perfume house",
    "premium fragrance interpretations",
    "affordable luxury perfume",
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
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <Providers>
          {children}
          <WhatsAppFloating />
          <EarlyBirdPopup />
        </Providers>
      </body>
    </html>
  );
}
