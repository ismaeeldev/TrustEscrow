import "dotenv/config";
import { db } from "../lib/db";

async function listOrders() {
  const orders = await db.order.findMany();
  console.log("All orders in DB:");
  orders.forEach(o => console.log(o.id, o.status));
}
listOrders().catch(console.error);
