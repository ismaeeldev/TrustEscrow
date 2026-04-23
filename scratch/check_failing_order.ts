import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const orderId = '1fa1308a-582e-4eb7-b6a6-170efe05fd8f';
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  console.log('Order Details:');
  console.log(JSON.stringify(order, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
