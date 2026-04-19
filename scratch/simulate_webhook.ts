import "dotenv/config";
import { paymentService } from "../services/payment.service";
import { db } from "../lib/db";

async function simulateWebhook() {
  console.log("--- Simulating Stripe Webhook Locally ---");

  try {
    // 1. Get the most recent INITIATED order
    const order = await db.order.findFirst({
      where: { status: "INITIATED" },
      orderBy: { createdAt: "desc" }
    });

    if (!order) {
      console.log("❌ No INITIATED orders found. Create a new test order first.");
      return;
    }

    console.log(`Found pending order: ${order.id}`);
    console.log(`Simulating payment success for $${(order.amount / 100).toFixed(2)}...`);

    // 2. Directly call the payment service we use in the Webhook
    // Providing fake Stripe PaymentIntent IDs
    const updatedOrder = await paymentService.processSuccessfulPayment(
      order.id,
      `pi_simulated_${Date.now()}`,
      order.amount
    );

    console.log(`✅ SUCCESS! Order status updated to: ${updatedOrder.status}`);

    // 3. Verify Ledger Entry
    const ledger = await db.ledgerEntry.findFirst({
      where: { orderId: order.id }
    });

    if (ledger) {
      console.log(`✅ SUCCESS! Ledger entry found: ${ledger.type} for $${(ledger.amount / 100).toFixed(2)}`);
    } else {
      console.log("❌ ERROR: Ledger entry was not created!");
    }

    console.log("\n🔗 View your updated Order Status Page here:");
    console.log(`http://localhost:3000/status/${order.id}`);

  } catch (error) {
    console.error("❌ Failed to simulate webhook:", error);
  }
}

simulateWebhook().catch(console.error);
