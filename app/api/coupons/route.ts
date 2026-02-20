import { NextResponse } from "next/server";
import { getActiveCoupons } from "@/lib/db/coupons";

export async function GET() {
  try {
    const activeCoupons = await getActiveCoupons();
    return NextResponse.json(activeCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

