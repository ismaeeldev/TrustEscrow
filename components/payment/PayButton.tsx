"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

interface PayButtonProps {
  checkoutUrl: string;
}

export function PayButton({ checkoutUrl }: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Smooth delay before redirect for visual feedback
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 400);
  };

  return (
    <Button 
      onClick={handlePay}
      disabled={loading}
      className="w-full h-14 bg-[#22C55E] hover:bg-[#1DA850] text-white text-lg font-bold rounded-xl shadow-lg border-0 transition-all hover:shadow-xl active:scale-[0.98] group"
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <span className="flex items-center justify-center gap-2">
          Pay Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      )}
    </Button>
  );
}
