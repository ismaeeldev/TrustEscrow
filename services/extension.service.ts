import { BaseService } from "./base.service";
import { orderRepo } from "@/repositories/order.repo";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import { OrderStatus, LedgerType } from "@prisma/client";

export class ExtensionService extends BaseService {
  /**
   * Creates a proxy escrow order where funds are held via Manual Capture.
   */
  async createProxyOrder(payload: { 
    buyer_email: string; 
    amount: number; 
    store_url: string; 
    product_name: string;
    payment_method_id: string;
  }) {
    try {
      logger.info("ExtensionService: Initiating proxy order hold", payload);

      // 1. Create Internal Order Record
      logger.info("ExtensionService: Step 1 - Creating order record in DB");
      const order = await orderRepo.createOrder({
        buyerEmail: payload.buyer_email,
        amount: payload.amount,
        sellerEmail: "proxy@trustescrow.internal", // Internal indicator for proxy/extension orders
        storeUrl: payload.store_url,
        productName: payload.product_name
      });
      logger.info("ExtensionService: Order record created", { order_id: order.id });

      // 2. Create and Confirm Payment Intent with Manual Capture (Simulated Hold)
      logger.info("ExtensionService: Step 2 - Creating Stripe Payment Intent");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: payload.amount,
        currency: "usd",
        payment_method_types: ["card"],
        capture_method: "manual", // CRITICAL: This holds the funds without capturing
        payment_method: payload.payment_method_id, 
        confirm: true, // Confirm immediately to simulate buyer payment
        return_url: "http://localhost:3000/api/extension/callback", // Required for confirmation
        metadata: {
          order_id: order.id,
          store_url: payload.store_url.substring(0, 490), // Truncate to fit Stripe 500 char limit
          product_name: payload.product_name.substring(0, 490),
          type: "proxy_escrow_hold"
        },
      });

      // 3. Store Payment Intent ID
      await orderRepo.updateStripePaymentIntent(order.id, paymentIntent.id);
      await orderRepo.updateStatus(order.id, OrderStatus.FUNDS_HELD);

      // 4. Generate Mock Virtual Card (Replace with Stripe Issuing in production)
      const virtualCard = this._generateMockVirtualCard();

      return {
        order_id: order.id,
        client_secret: paymentIntent.client_secret,
        virtual_card: virtualCard,
        status: OrderStatus.FUNDS_HELD,
        message: "Funds successfully held. Use the virtual card to complete the purchase on the store."
      };
    } catch (error) {
      return this.handleError("ExtensionService.createProxyOrder", error);
    }
  }

  /**
   * Verifies delivery based on extension's browser sensor and releases funds.
   */
  async verifyAndRelease(orderId: string, proofUrl: string) {
    try {
      logger.info("ExtensionService: Delivery verified by browser sensor, releasing funds", { orderId, proofUrl });

      const order = await orderRepo.findById(orderId);
      if (!order) throw new Error("Order not found");

      if (order.status !== OrderStatus.FUNDS_HELD) {
        throw new Error("Order is not in a state that can be released (Must be FUNDS_HELD)");
      }

      // 1. Capture the Payment Intent (Actually take the money from the buyer)
      if (order.stripePaymentIntentId) {
        await stripe.paymentIntents.capture(order.stripePaymentIntentId);
        logger.info("Stripe: Payment Intent captured successfully", { id: order.stripePaymentIntentId });
      }

      // 2. Atomic update: Update status and create ledger entry
      return await db.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { 
            status: OrderStatus.RELEASED,
            deliveryProof: proofUrl
          },
        });

        await tx.ledgerEntry.create({
          data: {
            orderId,
            type: LedgerType.CREDIT,
            amount: order.amount,
            description: `Proxy order funds captured and released upon delivery verification.`,
          },
        });

        // 3. Create Transaction Record for Capture
        await tx.transaction.create({
          data: {
            orderId,
            stripePaymentIntentId: order.stripePaymentIntentId,
            status: "SUCCESS",
          },
        });

        return updatedOrder;
      });
    } catch (error) {
      return this.handleError("ExtensionService.verifyAndRelease", error);
    }
  }

  /**
   * Helper to generate a mock virtual card for testing purposes.
   */
  private _generateMockVirtualCard() {
    return {
      number: "4242 4242 4242 " + Math.floor(1000 + Math.random() * 9000),
      expiry: "12/28",
      cvv: Math.floor(100 + Math.random() * 899).toString(),
      holder: "TrustEscrow Proxy User"
    };
  }
}

export const extensionService = new ExtensionService();
