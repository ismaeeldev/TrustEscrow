import "dotenv/config";
import { stripe } from "../lib/stripe";

async function checkAccount() {
  try {
    const accountId = "acct_1TNVWmLNkHSYmC0l";
    console.log(`Checking account: ${accountId}`);
    
    // Fetch the account
    const account = await stripe.accounts.retrieve(accountId);
    console.log("Account Type:", account.type);
    console.log("Capabilities:", JSON.stringify(account.capabilities, null, 2));

    // Try to request transfers capability
    if (account.capabilities?.transfers !== "active") {
      console.log("\nAttempting to request 'transfers' capability automatically...");
      const updatedAccount = await stripe.accounts.update(accountId, {
        capabilities: {
          transfers: { requested: true },
        },
      });
      console.log("Updated Capabilities:", JSON.stringify(updatedAccount.capabilities, null, 2));
    } else {
      console.log("Transfers capability is ALREADY active! The previous error shouldn't happen.");
    }
    
  } catch (err: any) {
    console.error("Stripe Error:", err.message);
  }
}

checkAccount();
