import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Escrow Logic",
      content: "TrustEscrow acts as a neutral third party. When a buyer initiates a payment, funds are captured via Stripe and held in a secure vault. Funds are only released to the seller upon verification of delivery and administrative approval."
    },
    {
      title: "2. Seller Obligations",
      content: "Sellers must provide valid proof of delivery (tracking numbers, digital file hashes, or service completion logs). Providing fraudulent proof will result in permanent account suspension and forfeiture of funds."
    },
    {
      title: "3. Buyer Protection",
      content: "Buyers are protected under our 'Hold-and-Release' guarantee. If a seller fails to provide proof within the agreed timeframe, buyers may dispute the transaction for a full refund (minus processing fees)."
    },
    {
      title: "4. Fees & Payouts",
      content: "TrustEscrow charges a service fee for every transaction. Payouts are processed via Stripe Connect and may be subject to standard merchant processing times (usually 2-7 business days)."
    },
    {
      title: "5. Dispute Resolution",
      content: "All disputes are subject to manual review by TrustEscrow administrators. Our decision in any dispute is final and binding based on the evidence provided by both parties."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#22C55E]/30 antialiased p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <ShieldCheck className="w-8 h-8 text-[#22C55E]" />
            <span className="text-xl font-bold tracking-tight">TrustEscrow</span>
          </Link>
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 font-bold">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 font-medium text-lg">Last updated: April 19, 2026</p>
        </div>

        <div className="grid gap-12 pt-8">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
              <h2 className="text-2xl font-bold text-[#22C55E] tracking-tight">{section.title}</h2>
              <p className="text-slate-300 leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <footer className="pt-20 pb-12 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Contact legal@trustescrow.com for any inquiries regarding these terms.
          </p>
        </footer>
      </div>
    </div>
  );
}
