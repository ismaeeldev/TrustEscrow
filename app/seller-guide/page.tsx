import { ShieldCheck, ArrowRight, Zap, Lock, ShieldIcon, CheckCircle, Mail, CreditCard, CheckCircle2, AlertTriangle, Lightbulb, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function SellerGuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-white selection:bg-[#22C55E]/30 antialiased overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      <main className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          {/* Hero Header */}
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-[#22C55E]/10 border border-[#22C55E]/20 px-4 py-1.5 rounded-full text-[10px] font-black text-[#22C55E] tracking-[0.2em] uppercase mb-4 shadow-xl">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Seller Intelligence v1.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl">
              Seller's Guide: <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-emerald-400">
                Scale Your Revenue.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Welcome to the TrustEscrow Seller Network. This guide will take you from zero to high-volume revenue using our automated hold-and-release infrastructure.
            </p>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 gap-8 pt-12">
            
            {/* Step 1 */}
            <div className="group bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] hover:bg-white/[0.08] transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/5 italic">01</div>
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-[#22C55E]/20 text-[#22C55E] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#22C55E]/10">
                   <Globe className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">Access the Onboarding Portal</h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed">
                    Everything starts at our secure onboarding link. Launch the portal to begin your integration.
                  </p>
                </div>
                <div className="bg-[#0F172A] border border-white/5 p-4 rounded-2xl font-mono text-sm text-[#22C55E]">
                  {process.env.NEXT_PUBLIC_APP_URL}/onboard
                </div>
              </div>
            </div>

            {/* Step 2 & 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] hover:bg-white/[0.08] transition-all duration-500">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Register Email</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Enter your business email and click "Connect with Stripe". We use industry-standard encryption to handle your payouts.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] hover:bg-white/[0.08] transition-all duration-500">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Magic Onboarding</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  In Test Mode, simply click "Skip this form" to instantly activate. In production, securely link your bank account.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group bg-gradient-to-br from-[#22C55E]/20 to-transparent backdrop-blur-3xl border border-[#22C55E]/30 p-8 md:p-12 rounded-[40px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/5 italic">04</div>
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-[#22C55E] text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#22C55E]/40">
                   <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">Obtain Your Seller ID</h2>
                  <p className="text-white/80 font-medium text-lg leading-relaxed">
                    Copy your unique <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[#22C55E]">acct_...</span> ID. This is your private key to receiving funds.
                  </p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Lock className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Store this ID in a secure environment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Diagram Section */}
          <div className="bg-white/5 rounded-[60px] p-12 md:p-20 border border-white/10 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight italic">How You Get Paid</h2>
              <p className="text-slate-400 font-medium max-w-xl mx-auto">
                Our Hold-and-Release system is designed for maximum speed and zero friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: "Order Created", desc: "Buyer initiates an order and funds are requested." },
                { title: "Funds Held", desc: "Money enters the 'Digital Vault' with status FUNDS HELD." },
                { title: "Delivery Proof", desc: "You submit tracking or file hashes via our API." },
                { title: "Instant Payout", desc: "Admin releases funds directly to your Stripe account." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shrink-0 font-black text-xs text-[#22C55E] group-hover:bg-[#22C55E] group-hover:text-slate-900 transition-all">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black tracking-tight">{step.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
              <AlertTriangle className="text-amber-400 w-8 h-8" />
              Troubleshooting for Beginners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[32px] space-y-4">
                <h4 className="text-xl font-bold text-amber-400">Account Restricted?</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  This usually means Stripe needs more info (photo ID). In our test environment, just click "Skip" to bypass this verification.
                </p>
              </div>
              <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[32px] space-y-4">
                <h4 className="text-xl font-bold text-blue-400">Where is my money?</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Funds stay in Escrow until the Admin clicks "Release". Check the Audit Ledger on your order page for real-time logs.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#22C55E] to-emerald-500 rounded-[40px] p-12 text-slate-950 text-center space-y-8 shadow-2xl shadow-[#22C55E]/20">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl">
               <Lightbulb className="w-10 h-10 fill-current" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter">Ready to start?</h2>
              <p className="text-slate-900 font-bold opacity-80 max-w-md mx-auto">
                Join our premium network of sellers and start protecting your revenue today.
              </p>
            </div>
            <Button asChild className="h-16 px-12 !bg-slate-950 !text-white hover:!bg-black font-black rounded-2xl transition-all shadow-xl hover:translate-y-[-4px] border-0 text-lg">
               <Link href="/onboard" className="flex items-center justify-center">Join as Seller</Link>
            </Button>
          </div>

          {/* Footer Copy */}
          <div className="text-center pt-12 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">
              &copy; 2026 TrustEscrow Systems Logic | Secure. Automated. Trusted.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
