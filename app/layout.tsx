import type { Metadata } from "next";
export const runtime = "nodejs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustEscrow | Secure Hold-and-Release Payments",
  description: "Advanced financial infrastructure for secure online transactions. Protecting buyers and sellers with immutable audit trails and verified delivery proof.",
  keywords: ["escrow", "secure payments", "trust escrow", "payment protection", "seller onboarding"],
  authors: [{ name: "TrustEscrow Systems" }],
  openGraph: {
    title: "TrustEscrow | Secure Hold-and-Release",
    description: "Industry-leading escrow protection for digital commerce.",
    type: "website",
    url: "https://trustescrow.com",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0F172A]">
        {children}
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}
