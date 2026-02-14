import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Inspired Perfumes",
  description:
    "Browse our complete collection of premium inspired fragrances. Affordable alternatives to Dior, Chanel, Tom Ford, Creed, YSL, Gucci and more iconic designer scents.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
