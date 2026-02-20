import { db } from "@/db";
import { coupons } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { coupons as localCoupons, type CouponData } from "@/data/coupons";

function transformCoupon(row: any): CouponData {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    type: row.type,
    value: parseFloat(row.value),
    minSubtotal: parseFloat(row.minSubtotal),
    active: Boolean(row.active),
  };
}

export async function getActiveCoupons(): Promise<CouponData[]> {
  try {
    const rows = await db.select().from(coupons).where(eq(coupons.active, true));
    return rows.map(transformCoupon);
  } catch (error) {
    console.error("Error loading coupons from DB, using local fallback:", error);
    return localCoupons.filter((c) => c.active);
  }
}

export async function getCouponByCode(code: string): Promise<CouponData | null> {
  try {
    const [row] = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true)))
      .limit(1);
    if (!row) return null;
    return transformCoupon(row);
  } catch (error) {
    console.error(`Error loading coupon ${code} from DB, using local fallback:`, error);
    const local = localCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    return local ?? null;
  }
}

