import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db/products";
import { getRelatedBlogPostsByProductId } from "@/lib/db/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import Seo from "@/components/Seo";
import {
  getProductSchema,
  getBreadcrumbSchema,
  getProductFAQSchema,
  getProductReviewSchema,
} from "@/lib/seo";
import type { Metadata } from "next";
import ProductDetailView from "./ProductDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const perfume = await getProductById(id);
  if (!perfume)
    return { title: "Product Not Found" };
  return {
    title: `${perfume.name} — ${perfume.inspirationBrand} ${perfume.inspiration} Inspired Perfume`,
    description: perfume.seoDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [perfume, relatedBlogs] = await Promise.all([
    getProductById(id),
    getRelatedBlogPostsByProductId(id, 3),
  ]);

  if (!perfume) {
    notFound();
  }

  const productJsonLd = [
    getProductSchema(perfume),
    getProductFAQSchema(perfume),
    getProductReviewSchema(perfume),
    getBreadcrumbSchema([
      { name: "Home", url: "https://humeperfumes.com" },
      { name: "Shop", url: "https://humeperfumes.com/shop" },
      { name: perfume.name, url: `https://humeperfumes.com/product/${perfume.id}` },
    ]),
  ];

  return (
    <main className="bg-background min-h-screen">
      <Seo
        title={`${perfume.name} — ${perfume.inspirationBrand} ${perfume.inspiration} Inspired Perfume`}
        description={perfume.seoDescription}
        image={perfume.images?.[0]}
        url={`https://humeperfumes.com/product/${perfume.id}`}
      />
      <JsonLd data={productJsonLd} />
      <Header />
      <ProductDetailView perfume={perfume} relatedBlogs={relatedBlogs} />
      <Footer />
    </main>
  );
}
