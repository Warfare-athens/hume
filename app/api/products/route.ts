import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { perfumes as localPerfumes } from "@/data/perfumes";
import { requireAdminToken } from "@/lib/admin-auth";

const imageUrlSchema = z
  .array(z.string().trim().url())
  .min(1, "At least one image URL is required");
const defaultCelebImage = "https://placehold.co/600x600?text=Celeb";

// GET all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const gender = searchParams.get("gender");

    let query = db.select().from(products);

    if (categoryId && categoryId !== "all") {
      query = query.where(eq(products.categoryId, categoryId)) as any;
    }

    if (gender) {
      query = query.where(eq(products.gender, gender as any)) as any;
    }

    const allProducts = await query;

    // Fetch reviews for each product
    const productsWithReviews = await Promise.all(
      allProducts.map(async (product) => {
        const productReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, product.id));

        return {
          ...product,
          price: parseFloat(product.price),
          reviews: productReviews.map((r) => ({
            ...r,
            rating: parseFloat(r.rating),
          })),
        };
      })
    );

    return NextResponse.json(productsWithReviews);
  } catch (error) {
    console.error("Error fetching products:", error);
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const gender = searchParams.get("gender");

    const filtered = localPerfumes.filter((p) => {
      const categoryMatch = !categoryId || categoryId === "all" || p.categoryId === categoryId;
      const genderMatch = !gender || p.gender === gender;
      return categoryMatch && genderMatch;
    });

    return NextResponse.json(filtered);
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  const unauthorized = requireAdminToken(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const productSchema = z.object({
      id: z.string(),
      name: z.string(),
      inspiration: z.string(),
      inspirationBrand: z.string(),
      woreBy: z.string().optional().nullable(),
      woreByImageUrl: z.string().trim().url().default(defaultCelebImage),
      category: z.string(),
      categoryId: z.string(),
      gender: z.enum(["Men", "Women", "Unisex"]),
      images: imageUrlSchema,
      price: z.number(),
      priceCurrency: z.literal("INR").optional().default("INR"),
      description: z.string(),
      seoDescription: z.string(),
      seoKeywords: z.array(z.string()),
      notes: z.object({
        top: z.array(z.string()),
        heart: z.array(z.string()),
        base: z.array(z.string()),
      }),
      longevity: z.object({
        duration: z.string(),
        sillage: z.string(),
        season: z.array(z.string()),
        occasion: z.array(z.string()),
      }),
      size: z.string(),
    });

    const validatedData = productSchema.parse(body);

    const [newProduct] = await db
      .insert(products)
      .values({
        ...validatedData,
        price: validatedData.price.toString(),
      })
      .returning();

    return NextResponse.json(
      {
        ...newProduct,
        price: parseFloat(newProduct.price),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
