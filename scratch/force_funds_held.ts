import "dotenv/config";
import { db } from "../lib/db";

async function force() {
  const order = await db.order.findFirst({ where: { status: "INITIATED" } });
  if (order) {
    await db.order.update({
      where: { id: order.id },
      data: { status: "FUNDS_HELD" }
    });
    console.log(`✅ Order ${order.id} is now FUNDS_HELD. Go check the UI now!`);
  } else {
    console.log("No INITIATED orders found. Create one first via the API!");
  }
}

force().catch(console.error);
