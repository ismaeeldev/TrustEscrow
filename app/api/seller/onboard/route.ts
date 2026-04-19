import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { userRepo } from "@/repositories/user.repo";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    logger.info("Seller onboarding initiated", { email });

    // 1. Check if user already has a stripe account
    const existingUser = await userRepo.findByEmail(email);
    let stripeAccountId = existingUser?.stripeAccountId;

    // 2. Create Stripe Account if it doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: email,
        capabilities: {
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
      
      // Save to our DB
      await userRepo.upsertSeller(email, stripeAccountId);
    }

    // 3. Create Account Link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${env.NEXT_PUBLIC_APP_URL}/onboard?email=${encodeURIComponent(email)}`,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/onboard/success?email=${encodeURIComponent(email)}`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId
    });

  } catch (error: any) {
    logger.error("Seller onboarding failed", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await userRepo.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      accountId: user.stripeAccountId,
      email: user.email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
