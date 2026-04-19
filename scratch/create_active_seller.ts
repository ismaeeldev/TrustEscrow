import "dotenv/config";
import { stripe } from "../lib/stripe";

async function createActiveAccount() {
  try {
    console.log("🚀 Creating a fully auto-verified Custom Connected Account...");

    // Stripe allows bypassing test mode verification by providing fake identity data
    // for Custom accounts.
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: "test.verified.seller@trustescrow.com",
      capabilities: {
        transfers: { requested: true },
      },
      business_type: "individual",
      business_profile: {
        url: "https://www.google.com",
        mcc: "5734"
      },
      external_account: "tok_visa",
      individual: {
        first_name: "John",
        last_name: "Doe",
        dob: { day: 1, month: 1, year: 1990 },
        address: {
          line1: "123 Test St",
          city: "San Francisco",
          state: "CA",
          postal_code: "94105",
        },
        email: "test.verified.seller@trustescrow.com",
        phone: "8888675309",
        id_number: "000000000", // The magic test mode SSN bypass string
        ssn_last_4: "0000",
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: "127.0.0.1",
      },
    });

    console.log("✅ Successfully generated ACTIVE Connect Account:", account.id);
    
    // Explicitly check status
    const retrieved = await stripe.accounts.retrieve(account.id);
    console.log("Transfers verified:", retrieved.capabilities?.transfers === "active");

  } catch (err: any) {
    console.error("Stripe Error:", err.message);
  }
}

createActiveAccount();
