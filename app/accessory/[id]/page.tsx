import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { JsonLd } from "@/components/JsonLd";
import { getAccessoryById } from "@/lib/db/accessories";
import AccessoryDetailClient from "./AccessoryDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const accessory = await getAccessoryById(id);
  if (!accessory) return { title: "Accessory Not Found" };
  return {
    title: `${accessory.name} | HUME Accessories`,
    description: accessory.shortDescription,
  };
}

export default async function AccessoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: accessory.name,
    description: accessory.shortDescription,
    image: accessory.images,
    category: "Accessories",
    offers: {
      "@type": "Offer",
      price: accessory.price.toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://humefragrance.com/accessory/${accessory.id}`,
    },
    brand: { "@type": "Brand", name: "HUME Fragrance" },
  };

  return (
    <main className="bg-background min-h-screen">
      <Seo
        title={`${accessory.name} | HUME Accessories`}
        description={accessory.shortDescription}
        image={accessory.images[0]}
        url={`https://humefragrance.com/accessory/${accessory.id}`}
      />
      <JsonLd data={jsonLd} />
      <Header />
      <AccessoryDetailClient accessory={accessory} />
      <Footer />
    </main>
  );
}

