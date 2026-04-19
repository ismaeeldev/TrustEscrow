import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log("Recent Order IDs:");
  orders.forEach(o => console.log(`- ${o.id} (${o.status})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
