import "dotenv/config";
import { stripe } from "../lib/stripe";
import { db } from "../lib/db";

async function onboard() {
  try {
    console.log("🚀 Creating an Express Connected Account...");
    
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // Adjust if your Stripe account is in another country
      capabilities: {
        transfers: { requested: true },
      },
    });

    console.log(`✅ Created Account ID: ${account.id}`);

    console.log("🔗 Generating Onboarding link...");
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });

    console.log("\n--- ACTION REQUIRED ---");
    console.log("1. Open this link in your browser:");
    console.log(accountLink.url);
    console.log("\n2. In the top-right (or at the top), click 'Skip this form' or 'Use test data'.");
    console.log("3. Once completed, you will be redirected to example.com.");
    console.log("4. Then, update your order in Prisma Studio with this Account ID.");
    console.log("------------------------\n");

  } catch (err: any) {
    console.error("❌ Stripe Error:", err.message);
  }
}

onboard();
