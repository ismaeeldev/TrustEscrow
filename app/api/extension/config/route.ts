import { NextResponse } from "next/server";
import { withCors } from "@/lib/extension-utils";

export async function GET() {
  return withCors(NextResponse.json({
    stripe_public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  }));
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
