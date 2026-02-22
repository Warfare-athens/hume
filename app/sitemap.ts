import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/db/products";
import { getAllBlogPosts } from "@/lib/db/blog";
import { getAllAccessories } from "@/lib/db/accessories";
import { getProgrammaticSitemapEntries } from "@/lib/programmatic-seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://humefragrance.com";
  const [products, blogPosts, accessories] = await Promise.all([
    getAllProducts(),
    getAllBlogPosts(),
    getAllAccessories(),
  ]);

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const accessoryEntries = accessories.map((item) => ({
    url: `${baseUrl}/accessory/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const programmaticEntries = getProgrammaticSitemapEntries(baseUrl);

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/hume-special`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bestseller`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...productEntries,
    ...accessoryEntries,
    ...blogEntries,
    ...programmaticEntries,
  ];
}
