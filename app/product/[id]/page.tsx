import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db/products";
import { getRelatedBlogPostsByProductId } from "@/lib/db/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
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
  const canonicalUrl = `https://humefragrance.com/product/${perfume.id}`;
  return {
    title: `${perfume.name} â€” ${perfume.inspirationBrand} ${perfume.inspiration} Inspired Perfume`,
    description: perfume.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${perfume.name} | HUME Fragrance`,
      description: perfume.seoDescription,
      url: canonicalUrl,
      images: perfume.images?.[0] ? [perfume.images[0]] : [],
    },
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
      { name: "Home", url: "https://humefragrance.com" },
      { name: "Shop", url: "https://humefragrance.com/shop" },
      { name: perfume.name },
    ]),
  ];

  return (
    <main className="bg-background min-h-screen">
      <JsonLd data={productJsonLd} />
      <Header />
      <ProductDetailView perfume={perfume} relatedBlogs={relatedBlogs} />
      <Footer />
    </main>
  );
}

