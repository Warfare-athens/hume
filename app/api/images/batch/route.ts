import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { images } from "@/db/schema";

const linkSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/") || value.startsWith("http"), {
    message: "Link must start with / or http",
  });

const batchSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1).optional(),
      label: z.string().min(1),
      url: z.string().url(),
      link: linkSchema.optional(),
      usage: z.string().min(1).optional(),
      tags: z.array(z.string().min(1)).optional(),
    })
  ).min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = batchSchema.parse(body);

    const rowsToInsert = validatedData.items.map((item) => ({
      id: item.id ?? randomUUID(),
      label: item.label,
      url: item.url,
      link: item.link ?? null,
      usage: item.usage ?? "general",
      tags: item.tags ?? [],
    }));

    const inserted = await db.insert(images).values(rowsToInsert).returning();
    return NextResponse.json({ count: inserted.length, items: inserted });
  } catch (error) {
    console.error("Error creating images batch:", error);
    return NextResponse.json({ error: "Failed to create images batch" }, { status: 500 });
  }
}
