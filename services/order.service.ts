import { BaseService } from "./base.service";
import { orderRepo } from "@/repositories/order.repo";
import { CreateOrderSchema } from "@/schemas/order.schema";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import { env } from "@/config/env";

export class OrderService extends BaseService {
  async createInitialOrder(payload: any) {
    try {
      logger.info("Starting order creation process with Stripe integration", { payload });

      // 1. Validation
      const validatedData = CreateOrderSchema.safeParse(payload);
      if (!validatedData.success) {
        logger.warn("Order validation failed", validatedData.error.format());
        const firstError = validatedData.error.issues?.[0]?.message || "Validation failed";
        throw new Error(firstError);
      }

      const { buyer_email, amount, seller_email, seller_stripe_account_id } = validatedData.data;

      // 2. Repository call - Create initial record
      const order = await orderRepo.createOrder({
        buyerEmail: buyer_email,
        amount,
        sellerEmail: seller_email,
        sellerStripeAccountId: seller_stripe_account_id,
      });

      logger.info("Internal order record created", { orderId: order.id });

      // 3. Stripe Checkout Session Creation
      logger.info("Creating Stripe Checkout session...");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Escrow Service Payment",
                description: `Payment for Order #${order.id}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: buyer_email,
        metadata: {
          order_id: order.id,
        },
        payment_intent_data: {
          metadata: {
            order_id: order.id,
          },
        },
        success_url: `${env.NEXT_PUBLIC_APP_URL}/status/${order.id}?payment=success`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/status/${order.id}?payment=canceled`,
      });

      if (!session.url) {
        throw new Error("Failed to generate Stripe checkout URL");
      }

      // 4. Update order with session ID
      await orderRepo.updateStripeSession(order.id, session.id);

      logger.info("Order successfully integrated with Stripe", { 
        orderId: order.id, 
        stripeSessionId: session.id 
      });

      return {
        order_id: order.id,
        checkout_url: session.url,
        status: order.status,
        message: "Order initiated and checkout session created successfully",
      };
    } catch (error) {
      return this.handleError("OrderService.createInitialOrder", error);
    }
  }

  /**
   * Retrieves an existing active checkout session or creates a new one.
   */
  async getOrCreateCheckoutSession(orderId: string) {
    try {
      const order = await orderRepo.findById(orderId);
      if (!order) throw new Error("Order not found");

      // Only allow payment if status is INITIATED
      if (order.status !== "INITIATED") {
        return { order, checkout_url: null };
      }

      // Check for existing session
      if (order.stripeSessionId) {
        try {
          const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
          if (session.status === "open" && session.url) {
            logger.info("Reusing existing Stripe session", { orderId, sessionId: session.id });
            return { order, checkout_url: session.url };
          }
        } catch (e) {
          logger.warn("Existing Stripe session invalid or expired", { orderId });
        }
      }

      // Generate new session
      logger.info("Generating new Stripe session for order", { orderId });
      const session = await this._createStripeSession(orderId, order.buyerEmail, order.amount);
      
      await orderRepo.updateStripeSession(orderId, session.id);
      
      return { order, checkout_url: session.url };
    } catch (error) {
      return this.handleError("OrderService.getOrCreateCheckoutSession", error);
    }
  }

  private async _createStripeSession(orderId: string, email: string, amount: number) {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Escrow Service Payment",
              description: `Payment for Order #${orderId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: { order_id: orderId },
      payment_intent_data: {
        metadata: {
          order_id: orderId,
        },
      },
      success_url: `${env.NEXT_PUBLIC_APP_URL}/status/${orderId}?payment=success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/status/${orderId}?payment=canceled`,
    });
  }
}

export const orderService = new OrderService();
