import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();

    const { deliveryProof } = body;

    if (!deliveryProof) {
      return NextResponse.json(
        { success: false, message: "deliveryProof string is required" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    await db.order.update({
      where: { id: orderId },
      data: { deliveryProof }
    });

    logger.info("Delivery proof submitted for order", { orderId, deliveryProof });

    return NextResponse.json({
      success: true,
      message: "Delivery proof submitted successfully"
    }, { status: 200 });

  } catch (error) {
    logger.error("Failed to submit delivery proof", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
