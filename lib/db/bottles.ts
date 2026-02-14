import { db } from "@/db";
import { bottles } from "@/db/schema";
import type { Bottle } from "@/db/schema";

export type BottleData = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
};

function transformBottle(bottle: Bottle): BottleData {
  return {
    id: bottle.id,
    name: bottle.name,
    imageUrl: bottle.imageUrl,
    price: parseFloat(bottle.price),
  };
}

export async function getAllBottles(): Promise<BottleData[]> {
  try {
    const rows = await db.select().from(bottles);
    return rows.map(transformBottle);
  } catch (error) {
    console.error("Error loading bottles from DB:", error);
    return [];
  }
}
