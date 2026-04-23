import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia' as any,
});

async function listAccounts() {
  try {
    const accounts = await stripe.accounts.list({ limit: 10 });
    console.log(JSON.stringify(accounts.data, null, 2));
  } catch (error: any) {
    console.error('Error listing accounts:', error.message);
  }
}

listAccounts();
