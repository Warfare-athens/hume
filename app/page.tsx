import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/JsonLd";
import { getOrganizationSchema, getWebSiteSchema, getFAQSchema } from "@/lib/seo";
import { getAllProducts } from "@/lib/db/products";

const Craft = dynamic(() => import("@/components/Craft"), {
  loading: () => <div className="py-24 md:py-32" />,
});
const LatestJournal = dynamic(() => import("@/components/LatestJournal"), {
  loading: () => <div className="py-24 md:py-32" />,
});
const About = dynamic(() => import("@/components/About"), {
  loading: () => <div className="py-24 md:py-32" />,
});

export default async function Home() {
  const perfumes = await getAllProducts();
  const jsonLd = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getFAQSchema(),
  ];

  return (
    <main className="bg-background min-h-screen">
      <JsonLd data={jsonLd} />
      <Header />
      <Hero />
      <Collection perfumes={perfumes} />
      <Craft />
      <LatestJournal />
      <About />
      <Footer />
    </main>
  );
}
