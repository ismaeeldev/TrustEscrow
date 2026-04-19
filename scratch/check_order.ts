import "dotenv/config";
import { db } from "../lib/db";

async function checkOrder() {
  const orderId = "c275db53-1fe6-4c3e-9027-a182812e37a9";
  const order = await db.order.findUnique({
    where: { id: orderId }
  });
  console.log("Order found:", order);
}
checkOrder().catch(console.error);
