"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home, ShieldX } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[Protocol Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 antialiased selection:bg-red-500/20">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-700">
        
        <div className="relative inline-flex flex-col items-center">
          <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
            <ShieldX className="text-red-500 w-10 h-10" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Protocol Interrupted</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            The secure data path has encountered an unexpected variance. All operations have been halted for safety.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-[10px] text-red-400/80 break-all select-all">
          ERROR_HASH: {error.digest || "UNSPECIFIED_FAILURE"}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="h-14 bg-white text-[#0F172A] hover:bg-white hover:text-[#0F172A] font-black rounded-xl transition-all shadow-xl hover:translate-y-[-2px] group"
          >
            <RefreshCcw className="w-4 h-4 mr-2 group-active:rotate-180 transition-transform" />
            Resume Protocol
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className="h-12 text-slate-500 hover:text-white transition-colors"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Emergency Exit to Home
            </Link>
          </Button>
        </div>

        <p className="text-[10px] uppercase font-black text-slate-700 tracking-[0.4em]">
          TrustEscrow Security Core v2.1
        </p>
      </div>
    </div>
  );
}
