import "dotenv/config";
import { db } from "../lib/db";
import { OrderStatus } from "../app/generated/prisma";

async function resetAndCreate() {
  console.log("--- Resetting Test Environment ---");

  try {
    // 1. Delete all old test records to prevent ID confusion
    await db.ledgerEntry.deleteMany({});
    await db.order.deleteMany({});
    console.log("✅ Cleaned up old database records.");

    // 2. Create ONE fresh order
    const order = await db.order.create({
      data: {
        buyerEmail: "final_test@example.com",
        amount: 8500, // $85.00
        status: OrderStatus.INITIATED,
        currency: "usd"
      }
    });

    console.log("✅ Fresh Order created successfully!");
    console.log("---------------------------------------------------");
    console.log("NEW ORDER ID:", order.id);
    console.log("🚀 URL TO PAY:", `http://localhost:3000/pay/${order.id}`);
    console.log("---------------------------------------------------");

  } catch (error) {
    console.error("❌ Failed to reset environment:", error);
  }
}

resetAndCreate().catch(console.error);
