"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  AlertOctagon, 
  ArrowLeft, 
  ShieldAlert, 
  ExternalLink, 
  Search,
  BookOpen,
  HelpCircle,
  Copy,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrderErrorPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedError = localStorage.getItem(`stripe_error_${orderId}`);
    if (storedError) {
      setError(storedError);
    }
  }, [orderId]);

  const handleCopy = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopied(true);
      toast.success("Error log copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">No Error Found</h1>
          <p className="text-slate-500">We couldn't find any recent error logs for this order.</p>
          <Button variant="outline" onClick={() => router.back()}>Return to Order</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link 
          href={`/admin/orders/${orderId}`}
          className="group inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#0F172A] uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Intelligence</span>
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-red-50/50 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-sm">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">System Diagnostic</h1>
                <p className="text-slate-500 font-medium">Stripe Transfer Failure Log for ID: <span className="text-[#0F172A] font-bold">#{orderId?.toString().slice(0, 8) || "..."}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleCopy}
                variant="outline" 
                className="rounded-xl border-slate-200 h-12 px-6 gap-2 font-bold hover:bg-slate-50"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy Log"}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Payload</span>
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <div className="p-8">
                <div className="bg-[#0F172A] rounded-2xl p-6 overflow-hidden relative">
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">RAW_RESPONSE</div>
                  <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed custom-scrollbar max-h-[500px] overflow-y-auto">
                    {error}
                  </pre>
                </div>
              </div>
            </div>

            {/* Potential Resolution Steps */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                Recommended Resolution
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl flex gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 shadow-sm">1</div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Log in to the <span className="font-bold text-[#0F172A]">Stripe Dashboard</span> and locate the connected account associated with this seller.
                    </p>
                    <a 
                      href="https://dashboard.stripe.com/test/connect/accounts" 
                      target="_blank"
                      className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      Open Connect Dashboard <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 shadow-sm">2</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Check for <span className="font-bold text-[#0F172A]">Verification Requirements</span>. The error usually implies the seller is missing bank info or identity verification.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 shadow-sm">3</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Once verification is complete, return here and attempt the <span className="font-bold text-[#0F172A]">Release Funds</span> action again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Links */}
          <div className="space-y-6">
            <div className="bg-[#0F172A] rounded-[2rem] p-6 text-white space-y-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-2xl" />
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-black tracking-tight italic flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#22C55E]" />
                  Stripe Docs
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Understand more about transfer capabilities and account requirements.
                </p>
              </div>
              <a 
                href="https://stripe.com/docs/connect/account-capabilities" 
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                <span>Read Capabilities</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditor Warning</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                This is a <span className="text-red-500 font-bold underline underline-offset-4 decoration-red-200">Production Blocker</span>. Sellers cannot receive funds until this is resolved.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Diagnostics Engine v1.0.4</p>
        </div>

      </div>
    </div>
  );
}
