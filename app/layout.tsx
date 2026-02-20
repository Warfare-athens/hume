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
  metadataBase: new URL("https://humefragrance.com"),
  title: {
    default: "HUME Fragrance | Premium Inspired Perfumes in India | Shop Now",
    template: "%s | HUME Perfumes",
  },
  description:
    "HUME Fragrance | Premium inspired perfumes for men & women in India. 8-10hr longevity. Fresh, leather, smoky, marine & floral. Free shipping. Shop now.",
  icons: {
    icon: "/images/logo.png?v=2",
    shortcut: "/images/logo.png?v=2",
    apple: "/images/logo.png?v=2",
  },
  keywords: [
    "luxury fragrances",
    "modern perfume house",
    "premium fragrance interpretations",
    "affordable luxury perfume",
    "HUME perfumes",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "HUME Fragrance",
    url: "https://humefragrance.com",
    images: [
      {
        url: "/images/logo.png?v=2",
        width: 1024,
        height: 1024,
        alt: "HUME Fragrance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HUME Fragrance",
    description:
      "Premium inspired perfumes for men & women in India with refined quality and modern luxury.",
    images: ["/images/logo.png?v=2"],
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
        <link
          rel="preload"
          as="image"
          href="/images/collection-hero.jpg"
          fetchPriority="high"
        />
        <link rel="icon" href="/images/logo.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/images/logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png?v=2" />
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
