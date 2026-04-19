import { db } from "@/lib/db";
import { TransactionStatus } from "@prisma/client";

export interface CreateTransactionDTO {
  orderId: string;
  stripePaymentIntentId: string;
  status: TransactionStatus;
}

export class TransactionRepository {
  async createTransaction(data: CreateTransactionDTO) {
    return await db.transaction.create({
      data: {
        orderId: data.orderId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        status: data.status,
      },
    });
  }

  async findByPaymentIntentId(paymentIntentId: string) {
    return await db.transaction.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
  }
}

export const transactionRepo = new TransactionRepository();
