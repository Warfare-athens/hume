import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET all reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, id));

    return NextResponse.json(
      productReviews.map((r) => ({
        ...r,
        rating: parseFloat(r.rating),
      }))
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST create new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const reviewSchema = z.object({
      id: z.string(),
      author: z.string(),
      rating: z.number().min(1).max(5),
      date: z.string(),
      title: z.string(),
      content: z.string(),
      verified: z.boolean().default(false),
    });

    const validatedData = reviewSchema.parse(body);

    const [newReview] = await db
      .insert(reviews)
      .values({
        ...validatedData,
        productId: id,
        rating: validatedData.rating.toString(),
      })
      .returning();

    return NextResponse.json(
      {
        ...newReview,
        rating: parseFloat(newReview.rating),
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
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
