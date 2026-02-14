import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { perfumes as localPerfumes, type PerfumeData, type Review } from "@/data/perfumes";

// Transform database product to PerfumeData format
function transformProduct(product: any, productReviews: any[]): PerfumeData {
  const defaultCelebImage = "https://placehold.co/600x600?text=Celeb";
  return {
    id: product.id,
    name: product.name,
    inspiration: product.inspiration,
    inspirationBrand: product.inspirationBrand,
    woreBy: product.woreBy ?? undefined,
    woreByImageUrl: product.woreByImageUrl ?? defaultCelebImage,
    category: product.category,
    categoryId: product.categoryId,
    gender: product.gender,
    images: product.images as string[],
    price: parseFloat(product.price),
    priceCurrency: "INR",
    description: product.description,
    seoDescription: product.seoDescription,
    seoKeywords: product.seoKeywords as string[],
    notes: product.notes as {
      top: string[];
      heart: string[];
      base: string[];
    },
    longevity: product.longevity as {
      duration: string;
      sillage: string;
      season: string[];
      occasion: string[];
    },
    size: product.size,
    reviews: productReviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: parseFloat(r.rating),
      date: r.date,
      title: r.title,
      content: r.content,
      verified: r.verified,
    })),
  };
}

// Get all products
export async function getAllProducts(): Promise<PerfumeData[]> {
  try {
    const allProducts = await db.select().from(products);

    const productsWithReviews = await Promise.all(
      allProducts.map(async (product) => {
        const productReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, product.id));

        return transformProduct(product, productReviews);
      })
    );

    return productsWithReviews;
  } catch (error) {
    console.error("Error loading products from DB, using local fallback:", error);
    return localPerfumes;
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<PerfumeData | null> {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      return null;
    }

    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, id));

    return transformProduct(product, productReviews);
  } catch (error) {
    console.error(`Error loading product ${id} from DB, using local fallback:`, error);
    return localPerfumes.find((p) => p.id === id) ?? null;
  }
}

// Get products by category
export async function getProductsByCategory(
  categoryId: string
): Promise<PerfumeData[]> {
  try {
    const categoryProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId));

    const productsWithReviews = await Promise.all(
      categoryProducts.map(async (product) => {
        const productReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, product.id));

        return transformProduct(product, productReviews);
      })
    );

    return productsWithReviews;
  } catch (error) {
    console.error(`Error loading category ${categoryId} from DB, using local fallback:`, error);
    return localPerfumes.filter((p) => p.categoryId === categoryId);
  }
}
