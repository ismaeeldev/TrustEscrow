"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Copy, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email) {
      async function fetchSellerId(safeEmail: string) {
        try {
          const response = await fetch(`/api/seller/onboard?email=${encodeURIComponent(safeEmail)}`);
          const data = await response.json();
          if (data.accountId) {
             setSellerId(data.accountId);
          }
        } catch (err) {
          console.error("Failed to fetch seller ID");
        } finally {
          setLoading(false);
        }
      }
      fetchSellerId(email);
    } else {
      setLoading(false);
    }
  }, [email]);

  const copyToClipboard = () => {
    if (sellerId) {
      navigator.clipboard.writeText(sellerId);
      toast.success("Seller ID copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#22C55E]/30">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center shadow-lg shadow-green-500/10 mb-2">
            <CheckCircle2 className="text-[#22C55E] w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Setup Complete!</h1>
            <p className="text-slate-400 font-medium">Your trusted seller account is now active.</p>
          </div>
        </div>

        {/* Seller ID Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-3">
             <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Private Seller ID</span>
                <span className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Verified</span>
             </div>
             
             <div className="relative group">
               <div className="h-14 w-full bg-[#0F172A] border border-white/10 rounded-xl flex items-center px-4 overflow-hidden">
                 <code className="text-[#22C55E] font-mono text-sm md:text-base break-all">
                   {loading ? "Fetching ID..." : (sellerId || "Order data unavailable")}
                 </code>
               </div>
               <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-[#22C55E] hover:text-white text-slate-400 rounded-lg transition-all active:scale-95"
                  title="Copy ID"
               >
                 <Copy className="w-4 h-4" />
               </button>
             </div>
             
             <p className="text-[11px] text-slate-500 leading-relaxed px-1">
               Provide this ID when creating new orders via the API or your automated bot to ensure funds are routed to your account.
             </p>
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div className="space-y-3">
            <Button asChild className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl space-x-2 transition-all">
              <Link href="/admin/orders">
                 <span>Go to Orders</span>
                 <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full h-12 text-slate-400 hover:text-white hover:bg-white/5 font-bold rounded-xl space-x-2">
               <ExternalLink className="w-4 h-4" />
               <span>Stripe Dashboard</span>
            </Button>
          </div>
        </div>

        {/* Help Footer */}
        <div className="text-center">
           <p className="text-xs text-slate-500">
            Need help? Contact support at <span className="text-white font-medium">support@trustescrow.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OnboardSuccessPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin opacity-20" />
       </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
