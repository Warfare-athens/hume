import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bottles } from "@/db/schema";
import { withCloudinaryTransforms } from "@/lib/cloudinary";

function sortBySerialId<T extends { id: string }>(rows: T[]) {
  return [...rows].sort((a, b) => {
    const aNum = Number(a.id);
    const bNum = Number(b.id);
    const aIsNum = Number.isFinite(aNum);
    const bIsNum = Number.isFinite(bNum);
    if (aIsNum && bIsNum) return aNum - bNum;
    if (aIsNum) return -1;
    if (bIsNum) return 1;
    return a.id.localeCompare(b.id);
  });
}

export async function GET() {
  try {
    const rows = await db.select().from(bottles);
    const payload = sortBySerialId(rows).map((bottle) => ({
      ...bottle,
      imageUrl: withCloudinaryTransforms(bottle.imageUrl),
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
