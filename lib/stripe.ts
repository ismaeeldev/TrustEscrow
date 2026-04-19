import Stripe from "stripe";
import { env } from "@/config/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // @ts-ignore - Let Stripe use the account's default stable version
  apiVersion: null,
  typescript: true,
});
