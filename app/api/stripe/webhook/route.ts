import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { webhookHandler } from "@/services/webhook.handler";

export async function POST(req: NextRequest) {
  console.log("-----------------------------------------");
  console.log("🚀 [DEBUG] WEBHOOK REQUEST RECEIVED");
  console.log("-----------------------------------------");
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    logger.error("Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Missing configuration" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    logger.info(`Received Stripe webhook event: ${event.type}`, { eventId: event.id });
    console.log(`\x1b[32m[STRIPE WEBHOOK]\x1b[0m 🔔 Event Received: ${event.type}`);

    // Handle the event in the handler
    await webhookHandler.handleEvent(event);
    console.log(`\x1b[32m[STRIPE WEBHOOK]\x1b[0m ✅ Successfully handled ${event.type}`);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    logger.error("Webhook signature verification failed", { error: error.message });
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}
