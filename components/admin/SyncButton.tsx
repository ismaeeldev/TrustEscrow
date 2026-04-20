"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SyncButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Trigger Next.js data re-fetch
    router.refresh();
    
    // Simulate a brief delay for UI feedback
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Ledger Synchronized", {
        description: "Data has been successfully updated from the core protocol.",
      });
    }, 1000);
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-[#22C55E] rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-1000 pointer-events-none"></div>
      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="relative h-12 px-6 bg-white border-slate-100 rounded-xl hover:bg-slate-50 text-[#0F172A] font-bold gap-3 transition-all active:scale-95 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 text-[#22C55E] ${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        <span className="text-xs uppercase tracking-widest">Synchronize</span>
      </Button>
    </div>
  );
}
