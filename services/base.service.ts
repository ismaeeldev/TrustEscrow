import { logger } from "@/lib/logger";

export abstract class BaseService {
  protected handleError(context: string, error: unknown): never {
    logger.error(`[${context}] Error:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unknown error occurred in ${context}`);
  }
}
