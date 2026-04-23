"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2, ArrowRight, Wallet, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function OnboardPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/seller/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate onboarding");
      }

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative flex flex-col items-center justify-center p-4 antialiased overflow-hidden">
      <Navbar />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl z-10 flex flex-col space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl mb-2 animate-in fade-in zoom-in duration-700">
            <ShieldCheck className="text-[#22C55E] w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              Become a Trusted Seller
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Secure your transactions with the industry's most reliable escrow infrastructure.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-[#22C55E]/20 rounded-xl flex items-center justify-center text-[#22C55E]">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold">Fast Payouts</h3>
            <p className="text-slate-400 text-sm">Automated fund release once delivery is validated by our system.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold">Top Protection</h3>
            <p className="text-slate-400 text-sm">Eliminate Chargeback risk with our secure hold-and-release logic.</p>
          </div>
        </div>

        {/* Onboarding Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-20 duration-1000">
          <form onSubmit={handleOnboard} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1"
              >
                Business Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seller@yourbusiness.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-700 rounded-xl focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 !bg-[#22C55E] hover:!bg-[#1DA850] !text-white font-bold rounded-xl shadow-lg shadow-[#22C55E]/20 transition-all active:scale-[0.98] text-lg group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Connect with Stripe
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
          <p className="text-center text-[11px] text-slate-500 font-medium mt-6">
            We use Stripe for secure identity verification and payouts. 
            By continuing, you agree to our terms of service.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
           <p className="text-[10px] uppercase font-bold text-slate-600 tracking-[0.3em]">
            TrustEscrow Systems Proprietary Logic &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
