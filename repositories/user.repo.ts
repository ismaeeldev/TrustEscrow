import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export class UserRepository {
  async findByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
    });
  }

  async upsertSeller(email: string, stripeAccountId: string) {
    return await db.user.upsert({
      where: { email },
      update: {
        stripeAccountId,
        role: UserRole.seller,
      },
      create: {
        email,
        stripeAccountId,
        role: UserRole.seller,
      },
    });
  }
}

export const userRepo = new UserRepository();
