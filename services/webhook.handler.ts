import Stripe from "stripe";
import { logger } from "@/lib/logger";
import { paymentService } from "./payment.service";

export class WebhookHandler {
  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.order_id;
    const paymentIntentId = session.payment_intent as string;
    const amountTotal = session.amount_total;

    console.log("-----------------------------------------");
    console.log("💎 [WEBHOOK] Processing Checkout Session");
    console.log("ID:", session.id);
    console.log("Metadata Found:", session.metadata);
    console.log("-----------------------------------------");

    if (!orderId || !paymentIntentId || amountTotal === null) {
      console.error("❌ [WEBHOOK ERROR] Missing required fields. Payment cannot be mapped to an order.");
      console.log("Possible reason: Metadata 'order_id' was not passed correctly or this is a manual test trigger.");
      return;
    }

    try {
      await paymentService.processSuccessfulPayment(
        orderId,
        paymentIntentId,
        amountTotal
      );
      console.log(`✅ [WEBHOOK] Order ${orderId} updated to FUNDS_HELD successfully.`);
    } catch (error) {
      console.error("❌ [WEBHOOK ERROR] Database update failed:", error);
      logger.error("Error processing payment in webhook handler", error);
      throw error;
    }
  }

  // Handle other events as needed
  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }
  }
}

export const webhookHandler = new WebhookHandler();
