import { NextRequest, NextResponse } from "next/server";
import { extensionService } from "@/services/extension.service";
import { logger } from "@/lib/logger";
import { withCors, handleOptions } from "@/lib/extension-utils";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, proof_url } = body;

    if (!order_id || !proof_url) {
      return withCors(NextResponse.json({ error: "order_id and proof_url are required" }, { status: 400 }));
    }

    logger.info("Extension API: Delivery Verification Request", { order_id });

    const result = await extensionService.verifyAndRelease(order_id, proof_url);

    return withCors(NextResponse.json({
      success: true,
      order_id: result.id,
      status: result.status,
      message: "Delivery verified and funds released successfully"
    }));
  } catch (error: any) {
    logger.error("Extension API Error: /api/extension/verify-delivery", error);
    return withCors(NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    ));
  }
}
