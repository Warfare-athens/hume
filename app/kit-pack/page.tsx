import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KitPackShowcase from "@/components/KitPackShowcase";

export const metadata: Metadata = {
  title: "Build Your Kit - 4 x 20ml",
  description: "Create a custom 4 x 20ml perfume kit from our inspired fragrance collection.",
};

export default function KitPackPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <KitPackShowcase />
      <Footer />
    </main>
  );
}

