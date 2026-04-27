import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withCors } from "@/lib/extension-utils";
import { OrderStatus } from "@prisma/client";

/**
 * GET /api/extension/my-orders?email=...
 * Fetches all active escrow orders for a specific buyer email.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return withCors(NextResponse.json({ error: "Email is required" }, { status: 400 }));
  }

  try {
    const orders = await db.order.findMany({
      where: {
        buyerEmail: email,
        status: {
          in: [OrderStatus.FUNDS_HELD, OrderStatus.RELEASED]
        },
        sellerEmail: "proxy@trustescrow.internal" // Filter for extension orders
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20
    });

    return withCors(NextResponse.json({ orders }));
  } catch (error) {
    console.error("API Error [My Orders]:", error);
    return withCors(NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 }));
  }
}

// Handle preflight
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
