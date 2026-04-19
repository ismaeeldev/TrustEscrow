import { BaseService } from "./base.service";
import { orderRepo } from "@/repositories/order.repo";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { OrderStatus, LedgerType } from "@prisma/client";
import { stripe } from "@/lib/stripe";

export class EscrowService extends BaseService {
  /**
   * Validates if an order is in the correct state to release funds.
   */
  async validateOrderForRelease(orderId: string) {
    const order = await orderRepo.findById(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status !== OrderStatus.FUNDS_HELD) {
      logger.warn("Attempted to release funds for order not in FUNDS_HELD state", { 
        orderId, 
        currentStatus: order.status 
      });
      throw new Error(`Cannot release funds: Order status is ${order.status}, expected FUNDS_HELD`);
    }

    return order;
  }

  /**
   * Marks an order as released and creates an audit trail entry.
   */
  async markAsReleased(orderId: string) {
    try {
      logger.info("Starting fund release process", { orderId });

      // 1. Validate state
      const order = await this.validateOrderForRelease(orderId);

      // 2. Stripe Payout (Transfer)
      let transferId = `tr_mock_${Math.random().toString(36).substring(7)}`;
      
      if (order.sellerStripeAccountId) {
        try {
          const transfer = await stripe.transfers.create({
            amount: order.amount,
            currency: order.currency,
            destination: order.sellerStripeAccountId,
            metadata: {
              order_id: order.id,
            },
          });
          transferId = transfer.id;
          logger.info("Stripe transfer successful", { transferId, accountId: order.sellerStripeAccountId });
        } catch (stripeError) {
          logger.error("Stripe transfer failed", stripeError);
          throw new Error("Failed to disburse funds to seller. Stripe transfer failed.");
        }
      } else {
        logger.warn("Order missing sellerStripeAccountId, falling back to mock transfer for development", { orderId });
      }

      // 3. Atomic update and audit trail
      return await db.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.RELEASED },
        });

        // 4. Create Ledger Entry
        await tx.ledgerEntry.create({
          data: {
            orderId,
            type: LedgerType.DEBIT,
            amount: order.amount,
            description: `Funds released from escrow (Transfer ID: ${transferId})`,
          },
        });

        // 5. Create Transaction Record for Payout
        await tx.transaction.create({
          data: {
            orderId,
            stripeTransferId: transferId,
            status: "SUCCESS",
          },
        });

        logger.info("Funds successfully released and payout recorded", { 
          orderId, 
          transferId 
        });
        
        return updatedOrder;
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return this.handleError("EscrowService.markAsReleased", error);
    }
  }
}

export const escrowService = new EscrowService();
