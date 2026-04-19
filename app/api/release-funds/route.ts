import { NextRequest, NextResponse } from "next/server";
import { escrowService } from "@/services/escrow.service";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    // Authentication is handled automatically by middleware.ts via cookies

    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: "order_id is required" }, { status: 400 });
    }

    logger.info("Admin fund release requested", { order_id });

    // 2. Process Release
    const result = await escrowService.markAsReleased(order_id);

    return NextResponse.json({
      success: true,
      order_id: result.id,
      status: result.status,
      message: "Funds released successfully",
    });
  } catch (error: any) {
    logger.error("Failed to release funds via API", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
