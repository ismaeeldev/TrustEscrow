import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 antialiased selection:bg-[#22C55E]/20">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-700">
        
        <div className="relative inline-flex flex-col items-center">
          <div className="absolute -inset-4 bg-[#0F172A]/5 rounded-full blur-2xl" />
          <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
            <Search className="text-[#0F172A] w-10 h-10 opacity-20" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2">
            <ShieldAlert className="text-amber-500 w-8 h-8 animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase italic">Signal Lost</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            The requested resource hash could not be located in the central ledger. The path may have been decommissioned or redirected.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="h-14 bg-[#0F172A] text-white hover:bg-[#0F172A] font-black rounded-xl transition-all shadow-xl hover:translate-y-[-2px] group"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return to Base
            </Link>
          </Button>
        </div>

        <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em]">
          TrustEscrow Indexer v1.0
        </p>
      </div>
    </div>
  );
}
