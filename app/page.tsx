import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Collection from "@/components/Collection";
import Craft from "@/components/Craft";
import About from "@/components/About";
import LatestJournal from "@/components/LatestJournal";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getOrganizationSchema, getWebSiteSchema, getFAQSchema } from "@/lib/seo";

export default function Home() {
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
      <Collection />
      <Craft />
      <LatestJournal />
      <About />
      <Footer />
    </main>
  );
}
