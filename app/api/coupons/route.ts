import { NextResponse } from "next/server";
import { getActiveCoupons } from "@/lib/db/coupons";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("includeHidden") === "1";
    const activeCoupons = await getActiveCoupons({ cartOnly: !includeHidden });
    return NextResponse.json(activeCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}
