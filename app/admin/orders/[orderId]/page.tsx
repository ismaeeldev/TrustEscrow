import { orderRepo } from "@/repositories/order.repo";
import { ledgerService } from "@/services/ledger.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReleaseButton } from "@/components/admin/ReleaseButton";
import { env } from "@/config/env";
import { ShieldCheck, Mail, Calendar, DollarSign, ArrowLeft, History, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

interface AdminOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderId } = await params;

  // 1. Data Fetching (Authorization handled by middleware)
  const order = await orderRepo.findById(orderId);
  if (!order) {
    return notFound();
  }

  const ledgerEntries = await ledgerService.getOrderLedger(orderId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0F172A] font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Status Hub */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Order Details</h1>
            <p className="text-sm text-slate-500 font-medium">#{order.id}</p>
          </div>
          
          {order.status === "FUNDS_HELD" && (
            <ReleaseButton orderId={orderId} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Card */}
          <Card className="md:col-span-2 border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-[#0F172A] text-white p-8">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <Badge 
                    className={`
                      ${order.status === "INITIATED" ? "bg-amber-500/20 text-amber-500" : ""}
                      ${order.status === "FUNDS_HELD" ? "bg-blue-500/20 text-blue-500" : ""}
                      ${order.status === "RELEASED" ? "bg-[#22C55E]/20 text-[#22C55E]" : ""}
                      px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-0
                    `}
                  >
                    Current Status: {order.status.replace("_", " ")}
                  </Badge>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Escrow Amount</p>
                    <h2 className="text-4xl font-bold tracking-tight">${(order.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <ShieldCheck className="text-[#22C55E] w-8 h-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buyer Email</span>
                    <p className="text-sm font-semibold text-slate-900">{order.buyerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created On</span>
                    <p className="text-sm font-semibold text-slate-900">{format(order.createdAt, "PPP p")}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-slate-400 w-4 h-4" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stripe Session ID</span>
                  </div>
                  <code className="bg-slate-50 px-2 py-1 rounded text-[10px] text-slate-600 font-mono">
                    {order.stripeSessionId || "N/A"}
                  </code>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Delivery Proof (Tracking URL)</span>
                    <span className="text-[10px] text-slate-400">Review before releasing funds</span>
                  </div>
                  {order.deliveryProof ? (
                    <a 
                      href={order.deliveryProof.startsWith("http") ? order.deliveryProof : `https://${order.deliveryProof}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View Delivery Proof
                    </a>
                  ) : (
                    <span className="text-[11px] text-amber-500 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">Pending Proof Submission</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats sidebar? (optional, I'll put it in summary) */}
        </div>

        {/* Audit Trail Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="text-[#0F172A] w-5 h-5" />
            <h2 className="text-xl font-bold text-[#0F172A]">Ledger Audit Trail</h2>
          </div>
          
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[180px] text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-8">Timestamp</TableHead>
                  <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</TableHead>
                  <TableHead className="w-[120px] text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pr-8">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(ledgerEntries) && ledgerEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-b border-slate-50">
                    <TableCell className="text-[11px] text-slate-500 pl-8 font-medium">
                      {format(entry.createdAt, "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <Badge className={`
                        ${entry.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                        text-[9px] font-bold uppercase px-2 py-0.5 rounded-md shadow-none border-0
                      `}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-bold text-sm ${entry.type === "CREDIT" ? "text-green-600" : "text-slate-900"}`}>
                      {entry.type === "CREDIT" ? "+" : "-"}${(entry.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 italic pr-8">
                      {entry.description}
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!ledgerEntries || ledgerEntries.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic text-sm">
                      No ledger events recorded for this order.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* System Footer */}
        <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-8">
          TrustEscrow Auditor Interface v1.0
        </div>
      </div>
    </div>
  );
}
