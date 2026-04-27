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
    
    // Basic validation
    const { buyer_email, amount, store_url, product_name } = body;
    if (!buyer_email || !amount || !store_url) {
      return withCors(NextResponse.json({ error: "Missing required fields" }, { status: 400 }));
    }

    logger.info("Extension API: Proxy Order Request", { buyer_email, amount, store_url });

    const result = await extensionService.createProxyOrder({
      buyer_email,
      amount,
      store_url,
      product_name: product_name || "Any Store Product"
    });

    return withCors(NextResponse.json(result, { status: 201 }));
  } catch (error: any) {
    logger.error("Extension API Error: /api/extension/proxy-order", error);
    return withCors(NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    ));
  }
}
