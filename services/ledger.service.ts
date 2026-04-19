import { BaseService } from "./base.service";
import { ledgerRepo, CreateLedgerDTO } from "@/repositories/ledger.repo";
import { logger } from "@/lib/logger";
import { LedgerType } from "@prisma/client";

export class LedgerService extends BaseService {
  /**
   * Creates a new ledger entry for an order.
   */
  async createEntry(data: CreateLedgerDTO) {
    try {
      logger.info(`Creating ledger entry: ${data.type}`, { orderId: data.orderId, amount: data.amount });
      
      const entry = await ledgerRepo.createEntry(data);
      
      return entry;
    } catch (error) {
      return this.handleError("LedgerService.createEntry", error);
    }
  }

  /**
   * Retrieves the full audit trail for a specific order.
   */
  async getOrderLedger(orderId: string) {
    try {
      logger.info("Retrieving ledger entries for order", { orderId });
      
      const entries = await ledgerRepo.findByOrderId(orderId);
      
      return entries;
    } catch (error) {
      return this.handleError("LedgerService.getOrderLedger", error);
    }
  }
}

export const ledgerService = new LedgerService();
