import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia' as any,
});

async function checkRequirements() {
  const accountIds = [
    'acct_1TNzCgLKNOw6TFcC',
    'acct_1TNsRmLsC9cXCVez',
    'acct_1TNsNQLn5OK1jB07',
    'acct_1TNsMQLDg5csPILu',
    'acct_1TNe9GLNkHqTsTKE'
  ];

  for (const accountId of accountIds) {
    console.log(`\n--- Requirements for: ${accountId} ---`);
    try {
      const account = await stripe.accounts.retrieve(accountId);
      console.log(`Currently Due: ${JSON.stringify(account.requirements?.currently_due, null, 2)}`);
      console.log(`Disabled Reason: ${account.requirements?.disabled_reason || 'none'}`);
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
    }
  }
}

checkRequirements();
