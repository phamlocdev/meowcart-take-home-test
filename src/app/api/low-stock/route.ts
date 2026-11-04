import { NextRequest, NextResponse } from "next/server";
import { getLowStock } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");
  try {
    const data = await getLowStock(cursor);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load low stock" }, { status: 500 });
  }
}
