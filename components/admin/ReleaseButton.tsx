"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ReleaseButtonProps {
  orderId: string;
}

export function ReleaseButton({ orderId }: ReleaseButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRelease = async () => {
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/release-funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to release funds");
      }

      toast.success("Funds released successfully");
      setStatus("success");
      // Intentionally keep it open to show the success UI
      router.refresh(); 
    } catch (error: any) {
      setErrorMessage(error.message);
      setStatus("error");
      toast.error(error.message);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && status === "success") {
      // Clean up when closing after success
      setStatus("idle");
    }
    setOpen(isOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button 
          disabled={status === 'loading'}
          className="bg-[#22C55E] hover:bg-[#1DA850] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#22C55E]/10 transition-all active:scale-[0.98] gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ShieldCheck className="w-5 h-5" />
          )}
          {status === 'loading' ? "Processing..." : "Release Funds"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl max-w-md border-0 shadow-2xl overflow-hidden p-0">
        
        {/* SUCCESS STATE */}
        {status === "success" ? (
          <div className="bg-white p-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Successfully Released
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 mb-8">
              The funds have been transferred to the connected Stripe account and the order is finalized.
            </AlertDialogDescription>
            <Button
              onClick={() => handleOpenChange(false)}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 m-0"
            >
              Back to Dashboard
            </Button>
          </div>
        ) : (
          /* IDLE / ERROR / LOADING STATE */
          <>
            <div className={`p-6 text-center shadow-inner relative overflow-hidden ${status === 'error' ? 'bg-red-900' : 'bg-[#0F172A]'}`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 ${status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-[#22C55E]/20 text-[#22C55E]'}`}>
                {status === "error" ? <XCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-white relative z-10">
                {status === "error" ? "Release Failed" : "Confirm Fund Release"}
              </AlertDialogTitle>
            </div>
            
            <div className="p-6 space-y-4 bg-white">
              <AlertDialogDescription className="text-slate-500 text-base text-center leading-relaxed">
                {status === "error" ? (
                  <span className="text-red-600 font-medium">
                    {errorMessage}
                    <br/><br/>
                    <span className="text-slate-500 text-sm">Please resolve this issue in Stripe and try again.</span>
                  </span>
                ) : (
                  <span>
                    You are about to release funds to the seller. Please ensure you have reviewed the <strong>Delivery Proof</strong>. 
                    <br/><br/>
                    This action will initiate a Stripe transfer and is <strong className="text-amber-600">irreversible</strong>.
                  </span>
                )}
              </AlertDialogDescription>
              
              <AlertDialogFooter className="grid grid-cols-2 gap-4 mt-6">
                <AlertDialogCancel 
                  disabled={status === "loading"}
                  className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-medium h-12 m-0 bg-transparent"
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  onClick={handleRelease}
                  disabled={status === "loading"}
                  className={`w-full rounded-xl text-white font-bold h-12 m-0 ${
                    status === 'error' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-[#22C55E] hover:bg-[#1DA850] shadow-lg shadow-[#22C55E]/10'
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Releasing...
                    </>
                  ) : status === "error" ? (
                    "Retry Release"
                  ) : (
                    "Yes, Release Funds"
                  )}
                </Button>
              </AlertDialogFooter>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
