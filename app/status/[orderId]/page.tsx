import { orderRepo } from "@/repositories/order.repo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ShieldCheck, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { StatusAutoRefresh } from "./StatusAutoRefresh";

interface StatusPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment?: string }>;
}

export default async function StatusPage({ params, searchParams }: StatusPageProps) {
  const { orderId } = await params;
  const { payment } = await searchParams;
  const order = await orderRepo.findById(orderId);

  if (!order) {
    return notFound();
  }

  // Map status to steps
  const steps = [
    {
      id: "payment",
      label: "Payment Initiated",
      description: "Buyer has started the payment process",
      status: order.status === "INITIATED" ? "current" : "complete",
      icon: CreditCard,
    },
    {
      id: "escrow",
      label: "Funds in Escrow",
      description: "Funds are securely held by TrustEscrow",
      status: order.status === "FUNDS_HELD" ? "current" : (order.status === "RELEASED" ? "complete" : "upcoming"),
      icon: ShieldCheck,
    },
    {
      id: "released",
      label: "Funds Released",
      description: "Escrow period concluded and funds sent to seller",
      status: order.status === "RELEASED" ? "current" : "upcoming",
      icon: CheckCircle2,
    },
  ];

  const currentStatusLabel = order.status.replace("_", " ");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 antialiased selection:bg-[#22C55E]/20">
      {/* Auto-Refresh Logic */}
      <StatusAutoRefresh status={order.status} />

      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center shadow-md">
            <ShieldCheck className="text-[#22C55E] w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-[#0F172A]">TrustEscrow</span>
        </div>

        {/* Feedback Banners */}
        {payment === "success" && (
          <div className="mb-6 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
              <CheckCircle2 className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Payment Successful!</p>
              <p className="text-[11px] text-[#22C55E] font-medium">Your funds are now securely held in escrow.</p>
            </div>
          </div>
        )}

        {payment === "canceled" && (
          <div className="mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <CreditCard className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Payment Canceled</p>
              <p className="text-[11px] text-amber-600 font-medium">You can try the payment again whenever you're ready.</p>
            </div>
          </div>
        )}

        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-[#0F172A] text-white p-8">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-2xl font-semibold">Transaction Status</CardTitle>
              <Badge 
                className={`
                  ${order.status === "INITIATED" ? "bg-amber-500/20 text-amber-500 border-amber-500/20" : ""}
                  ${order.status === "FUNDS_HELD" ? "bg-blue-500/20 text-blue-500 border-blue-500/20" : ""}
                  ${order.status === "RELEASED" ? "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/20" : ""}
                  px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border
                `}
              >
                {currentStatusLabel}
              </Badge>
            </div>
            <CardDescription className="text-slate-400">
              Reference: #{orderId.substring(0, 13)}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {/* Timeline */}
            <div className="space-y-8 relative">
              {/* Vertical line connector */}
              <div className="absolute left-[23px] top-2 bottom-8 w-0.5 bg-[#E2E8F0]" />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = step.status === "complete";
                const isCurrent = step.status === "current";
                
                return (
                  <div 
                    key={step.id} 
                    className={`
                      relative flex items-start gap-6 group 
                      animate-in fade-in slide-in-from-left-8 duration-700
                    `}
                    style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                  >
                    {/* Circle Indicator */}
                    <div className={`
                      relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2
                      ${isComplete ? "bg-[#22C55E] border-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : ""}
                      ${isCurrent ? "bg-[#0F172A] border-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20 scale-110" : ""}
                      ${step.status === "upcoming" ? "bg-white border-[#E2E8F0] text-slate-300" : ""}
                    `}>
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="mt-1">
                      <h3 className={`
                        text-md font-bold transition-colors
                        ${isComplete ? "text-[#22C55E]" : ""}
                        ${isCurrent ? "text-[#0F172A]" : "text-slate-400"}
                      `}>
                        {step.label}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {isCurrent && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#0F172A] bg-[#0F172A]/5 py-2 px-3 rounded-lg w-fit animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Active Stage</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Details Footer */}
            <div className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Amount</span>
                <span className="text-lg font-bold text-[#0F172A]">
                  ${(order.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Buyer Account</span>
                <span className="text-sm font-semibold text-[#0F172A] truncate">
                  {order.buyerEmail.split('@')[0]}...
                </span>
              </div>
            </div>
          </CardContent>
          
          {/* Action Hint */}
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Need help? Contact our support via reference ID #{orderId.substring(0, 8)}
            </p>
          </div>
        </Card>
        
        <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale pointer-events-none">
          <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter">
            <ShieldCheck className="w-3 h-3" /> Secure Escrow
          </div>
          <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter">
            <CreditCard className="w-3 h-3" /> Certified Payment
          </div>
        </div>
      </div>
    </div>
  );
}
