import { db } from "@/lib/db";
import { LedgerType } from "@prisma/client";

export interface CreateLedgerDTO {
  orderId: string;
  type: LedgerType;
  amount: number;
  description: string;
}

export class LedgerRepository {
  async createEntry(data: CreateLedgerDTO) {
    return await db.ledgerEntry.create({
      data: {
        orderId: data.orderId,
        type: data.type,
        amount: data.amount,
        description: data.description,
      },
    });
  }

  async findByOrderId(orderId: string) {
    return await db.ledgerEntry.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const ledgerRepo = new LedgerRepository();
