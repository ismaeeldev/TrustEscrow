import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/order.service";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    logger.info("Received request to create order", body);

    const result = await orderService.createInitialOrder(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    logger.error("API Route Error: /api/orders/create", error);
    
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "Internal Server Error",
        success: false 
      }, 
      { status: 400 }
    );
  }
}
