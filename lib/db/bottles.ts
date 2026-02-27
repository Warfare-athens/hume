import { db } from "@/db";
import { bottles } from "@/db/schema";
import type { Bottle } from "@/db/schema";
import { withCloudinaryTransforms } from "@/lib/cloudinary";

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
    imageUrl: withCloudinaryTransforms(bottle.imageUrl),
    price: parseFloat(bottle.price),
  };
}

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

export async function getAllBottles(): Promise<BottleData[]> {
  try {
    const rows = await db.select().from(bottles);
    return sortBySerialId(rows).map(transformBottle);
  } catch (error) {
    console.error("Error loading bottles from DB:", error);
    return [];
  }
}
