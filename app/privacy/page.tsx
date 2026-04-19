import { ShieldCheck, ArrowLeft, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const points = [
    {
      icon: Eye,
      title: "Data We Collect",
      content: "We collect basic account information (email, seller name) and payment details required for financial compliance. For sellers, identity verification data is handled securely by our payment partner, Stripe."
    },
    {
      icon: Lock,
      title: "How We Protect It",
      content: "All sensitive data is encrypted at rest and in transit. We prioritize a 'less is more' approach to data retention, only keeping what is necessary for transaction security and regulatory audits."
    },
    {
      icon: Database,
      title: "Third-Party Sharing",
      content: "Your payment data is shared exclusively with Stripe. We do NOT sell user data to advertisers or third parties. Our business model is based on transaction security, not data monetization."
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 font-medium text-lg">Your data security is our core mission.</p>
        </div>

        <div className="grid gap-8 pt-8">
          {points.map((point, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 bg-[#22C55E]/20 text-[#22C55E] rounded-xl flex items-center justify-center">
                <point.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{point.title}</h2>
              <p className="text-slate-400 leading-relaxed font-medium">
                {point.content}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-8 rounded-3xl space-y-4">
           <h3 className="text-xl font-bold text-[#22C55E]">Cookies & Tracking</h3>
           <p className="text-sm text-slate-300 font-medium leading-relaxed">
             We use only essential cookies required for authentication and session management. We do not use cross-site tracking or invasive behavioral analytics.
           </p>
        </div>

        <footer className="pt-20 pb-12 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Contact privacy@trustescrow.com for any data accessibility requests.
          </p>
        </footer>
      </div>
    </div>
  );
}
