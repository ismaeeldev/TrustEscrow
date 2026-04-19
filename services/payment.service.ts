import { BaseService } from "./base.service";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { OrderStatus, LedgerType, TransactionStatus } from "@prisma/client";

export class PaymentService extends BaseService {
  async processSuccessfulPayment(orderId: string, paymentIntentId: string, amount: number) {
    return await db.$transaction(async (tx) => {
      logger.info("Processing successful payment transaction", { orderId, paymentIntentId });

      // 1. Check if already processed (Idempotency)
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      if (order.status === OrderStatus.FUNDS_HELD) {
        logger.warn("Order already marked as FUNDS_HELD, skipping", { orderId });
        return order;
      }

      // 2. Update Order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.FUNDS_HELD,
          stripePaymentIntentId: paymentIntentId,
        },
      });

      // 3. Create Ledger Entry
      await tx.ledgerEntry.create({
        data: {
          orderId,
          type: LedgerType.CREDIT,
          amount,
          description: `Funds received via Stripe Checkout (PI: ${paymentIntentId})`,
        },
      });

      // 4. Create Transaction Record
      await tx.transaction.create({
        data: {
          orderId,
          stripePaymentIntentId: paymentIntentId,
          status: TransactionStatus.SUCCESS,
        },
      });

      logger.info("Payment fulfillment completed successfully", { orderId });
      return updatedOrder;
    },
    {
      maxWait: 15000, // default: 2000
      timeout: 30000, // default: 5000
    });
  }
}

export const paymentService = new PaymentService();
