import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export class OrderRepository {
  async createOrder(data: { 
    buyerEmail: string; 
    amount: number; 
    sellerEmail?: string; 
    sellerStripeAccountId?: string;
    storeUrl?: string;
    productName?: string;
  }) {
    try {
      console.log("🛠️ OrderRepo: Attempting to create order in Prisma...", data.buyerEmail);
      const order = await db.order.create({
        data: {
          buyerEmail: data.buyerEmail,
          amount: data.amount,
          sellerEmail: data.sellerEmail,
          sellerStripeAccountId: data.sellerStripeAccountId,
          storeUrl: data.storeUrl,
          productName: data.productName,
          status: OrderStatus.INITIATED,
          currency: "usd", // Defaulting to usd as per schema
        },
        select: {
          id: true,
          status: true,
        },
      });
      console.log("✅ OrderRepo: Order created successfully", order.id);
      return order;
    } catch (error) {
      console.error("❌ OrderRepo: Error in createOrder", error);
      throw error;
    }
  }

  async updateStripeSession(orderId: string, sessionId: string) {
    return await db.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: sessionId,
      },
    });
  }

  async updateStripePaymentIntent(orderId: string, paymentIntentId: string) {
    return await db.order.update({
      where: { id: orderId },
      data: {
        stripePaymentIntentId: paymentIntentId,
      },
    });
  }

  async findById(id: string) {
    return await db.order.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await db.order.update({
      where: { id },
      data: { status },
    });
  }

  async findAll(params?: { page?: number; limit?: number; status?: OrderStatus | string | null }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.status && params.status !== "ALL") {
      where.status = params.status;
    }

    const [orders, totalCount] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return {
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}

export const orderRepo = new OrderRepository();
