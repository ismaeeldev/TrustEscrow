import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia' as any,
});

async function updateAccount() {
  const accountId = 'acct_1TNcoXLNkHiM1da5';
  
  console.log(`Starting update for account: ${accountId}`);
  
  try {
    // 1. Perform Partial Update
    const updatedAccount = await stripe.accounts.update(accountId, {
      capabilities: {
        transfers: {
          requested: true,
        },
      },
    });

    console.log('✅ Update request sent successfully.');

    // 2. Post-Update Verification
    const account = await stripe.accounts.retrieve(accountId);
    
    const transferStatus = account.capabilities?.transfers;

    console.log(`Verification Status: ${transferStatus || 'Unknown'}`);

    if (transferStatus === 'active' || transferStatus === 'pending') {
      console.log('🎉 Account is now capable or pending for transfers.');
    } else {
      console.log('⚠️ Status is not active/pending. Current status:', transferStatus);
      console.log('Requirements currently due:', JSON.stringify(account.requirements?.currently_due, null, 2));
    }

  } catch (error: any) {
    console.error('❌ Stripe Update Failed:', error.message);
    if (error.raw) {
      console.error('Raw Error Details:', JSON.stringify(error.raw, null, 2));
    }
  }
}

updateAccount();
