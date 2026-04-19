import { orderService } from "@/services/order.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { PayButton } from "@/components/payment/PayButton";

interface PayPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { orderId } = await params;

  // Fetch order and checkout session info
  const result = await orderService.getOrCreateCheckoutSession(orderId);

  // Handle errors or missing order
  if (!result || !result.order) {
    return notFound();
  }

  const { order, checkout_url } = result;
  const isPending = order.status === "INITIATED";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        {/* Logo / Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            <ShieldCheck className="text-[#22C55E] w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-[#0F172A] tracking-tight">TrustEscrow</span>
        </div>

        <Card className="border-[#E2E8F0] shadow-xl rounded-2xl overflow-hidden bg-white border-0">
          <CardHeader className="bg-[#0F172A] text-white p-8">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-2xl font-semibold">Secure Payment</CardTitle>
              <Badge 
                variant="outline" 
                className={`
                  ${order.status === "INITIATED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""}
                  ${order.status === "FUNDS_HELD" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                  ${order.status === "RELEASED" ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20" : ""}
                  px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                `}
              >
                {order.status.replace("_", " ")}
              </Badge>
            </div>
            <CardDescription className="text-slate-400 font-medium">
              Order #{orderId.substring(0, 8)}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-[#E2E8F0]">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Amount</p>
                <h2 className="text-4xl font-bold text-[#0F172A]">
                  ${(order.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="bg-[#22C55E]/10 p-4 rounded-2xl">
                <CreditCard className="text-[#22C55E] w-8 h-8" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 opacity-70" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Buyer Email</span>
                  <span className="text-sm font-medium">{order.buyerEmail}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-slate-600">
                <ShieldCheck className="w-5 h-5 opacity-70" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Escrow Protection</span>
                  <span className="text-sm font-medium">Funds held securely until release</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 md:p-8 pt-0 flex flex-col gap-4">
            {isPending ? (
              checkout_url ? (
                <PayButton checkoutUrl={checkout_url} />
              ) : (
                <Button disabled className="w-full h-14 text-white text-lg font-semibold rounded-xl opacity-50 cursor-not-allowed">
                  Checkout Unavailable
                </Button>
              )
            ) : (
              <div className="w-full p-4 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-xl flex items-center justify-center gap-2 animate-in zoom-in-95 duration-500">
                <ShieldCheck className="text-[#22C55E] w-5 h-5" />
                <span className="text-[#1DA850] font-bold text-sm">
                  {order.status === "FUNDS_HELD" ? "Payment Secured in Escrow" : "Funds Successfully Released"}
                </span>
              </div>
            )}
            
            <p className="text-[10px] text-center text-slate-400 font-medium px-4 leading-relaxed">
              Secure payment processed by Stripe. By continuing, you agree to our <span className="underline underline-offset-2 hover:text-[#22C55E] cursor-pointer transition-colors">Terms of Service</span> and <span className="underline underline-offset-2 hover:text-[#22C55E] cursor-pointer transition-colors">Privacy Policy</span>.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-slate-400 text-xs font-medium">
          &copy; 2026 TrustEscrow System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
