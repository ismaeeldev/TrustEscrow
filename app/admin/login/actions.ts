"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData, redirectTo: string) {
  const secret = formData.get("secret") as string;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!secret || secret !== adminSecret) {
    return { error: "Invalid administrative secret key." };
  }

  // Set secure HTTP-only cookie
  const cookieStore = await cookies();
  
  cookieStore.set("admin_auth", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  // Redirect to the intended destination or dashboard
  redirect(redirectTo);
}
