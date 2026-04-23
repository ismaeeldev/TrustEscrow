import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia' as any,
});

async function updateAllAccounts() {
  const accountIds = [
    'acct_1TNzCgLKNOw6TFcC',
    'acct_1TNsRmLsC9cXCVez',
    'acct_1TNsNQLn5OK1jB07',
    'acct_1TNsMQLDg5csPILu',
    'acct_1TNe9GLNkHqTsTKE',
    'acct_1TNcoXLNkHiM1da5'
  ];

  for (const accountId of accountIds) {
    console.log(`\n--- Processing Account: ${accountId} ---`);
    try {
      const account = await stripe.accounts.retrieve(accountId);
      
      // Method 1: configurations (for newer account types)
      try {
        await stripe.accounts.update(accountId, {
          configurations: {
            recipient: {
              capabilities: {
                stripe_balance: {
                  stripe_transfers: {
                    requested: true,
                  },
                },
              },
            },
          } as any,
        });
        console.log('✅ Configuration update success.');
      } catch (e: any) {
        console.log('ℹ️ Configuration update not supported for this account type.');
      }

      // Method 2: Standard capabilities (for all accounts)
      try {
        await stripe.accounts.update(accountId, {
          capabilities: {
            transfers: {
              requested: true,
            },
          },
        });
        console.log('✅ Standard capabilities update success.');
      } catch (e: any) {
        console.log(`❌ Standard capabilities update failed: ${e.message}`);
      }

      // Verify
      const finalAcc = await stripe.accounts.retrieve(accountId);
      console.log(`Final Status (Transfers): ${finalAcc.capabilities?.transfers || 'unknown'}`);
      
    } catch (err: any) {
      console.error(`❌ Global error for ${accountId}: ${err.message}`);
    }
  }
}

updateAllAccounts();
