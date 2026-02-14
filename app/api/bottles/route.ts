import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bottles } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(bottles);
    const payload = rows.map((bottle) => ({
      ...bottle,
      price: parseFloat(bottle.price),
    }));
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching bottles:", error);
    return NextResponse.json({ error: "Failed to fetch bottles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bottleSchema = z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      imageUrl: z.string().url(),
      price: z.number().nonnegative(),
    });

    const validatedData = bottleSchema.parse(body);
    const [newBottle] = await db
      .insert(bottles)
      .values({
        id: validatedData.id,
        name: validatedData.name,
        imageUrl: validatedData.imageUrl,
        price: validatedData.price.toString(),
      })
      .returning();

    return NextResponse.json({
      ...newBottle,
      price: parseFloat(newBottle.price),
    });
  } catch (error) {
    console.error("Error creating bottle:", error);
    return NextResponse.json({ error: "Failed to create bottle" }, { status: 500 });
  }
}
