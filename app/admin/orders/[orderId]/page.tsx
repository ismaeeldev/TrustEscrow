import { orderRepo } from "@/repositories/order.repo";
import { ledgerService } from "@/services/ledger.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReleaseButton } from "@/components/admin/ReleaseButton";
import { 
  ShieldCheck, 
  Mail, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  History, 
  FileText,
  Hash,
  Activity,
  Globe,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

interface AdminOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderId } = await params;

  const order = await orderRepo.findById(orderId);
  if (!order) {
    return notFound();
  }

  const ledgerEntries = await ledgerService.getOrderLedger(orderId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 antialiased selection:bg-[#22C55E]/20">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div className="space-y-4">
            <Link 
              href="/admin/orders" 
              className="group flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#0F172A] uppercase tracking-[0.2em] transition-all"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>Return to Forge</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0F172A]/20">
                <Activity className="text-[#22C55E] w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter">Auditor Intelligence</h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">SESSION_TOKEN</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-xs font-mono font-bold text-[#0F172A]">{order.id.slice(0, 18)}...</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
            {order.status === "FUNDS_HELD" && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-[#22C55E] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                <ReleaseButton orderId={orderId} />
              </div>
            )}
            {order.status === "RELEASED" && (
              <div className="h-12 px-6 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl flex items-center justify-center gap-2 text-[#22C55E]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Settled</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
          
          {/* Main Status & Amount Card */}
          <div className="lg:col-span-2 group bg-[#0F172A] rounded-[2.5rem] p-10 overflow-hidden relative shadow-2xl shadow-[#0F172A]/20">
            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#22C55E]/10 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative h-full flex flex-col justify-between space-y-12">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operational Status</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.5)] ${
                      order.status === 'RELEASED' ? 'bg-[#22C55E]' :
                      order.status === 'FUNDS_HELD' ? 'bg-blue-400 shadow-blue-400' : 'bg-amber-400 shadow-amber-400'
                    }`} />
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase italic">
                      {order.status.replace("_", " ")}
                    </h2>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <ShieldCheck className="text-[#22C55E] w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Total Escrow Liquidity</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#22C55E] opacity-50">$</span>
                  <h3 className="text-7xl font-black text-white tracking-tighter tabular-nums leading-none">
                    {(order.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Stats */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Auditor Insight</p>
              <h4 className="text-lg font-black text-[#0F172A] leading-tight tracking-tight">Timeline Metrics</h4>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Entry Date</p>
                  <p className="text-sm font-bold text-[#0F172A]">{format(order.createdAt, "MMM d, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">History Count</p>
                  <p className="text-sm font-bold text-[#0F172A]">{ledgerEntries.length} Ledger Events</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Synced with NeonDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Intelligence Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          
          {/* Identity Card */}
          <div className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-[#0F172A] transition-all duration-500">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-[#0F172A] group-hover:text-[#22C55E] transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyer Identity</p>
                <p className="text-sm font-black text-[#0F172A] truncate tracking-tight">{order.buyerEmail}</p>
              </div>
            </div>
          </div>

          {/* Session Record */}
          <div className="lg:col-span-2 group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-[#0F172A] transition-all duration-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-[#0F172A] group-hover:text-[#22C55E] transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Stripe Verified
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stripe Session Hash</p>
                <p className="text-sm font-mono font-bold text-[#0F172A] break-all tracking-tighter leading-tight bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                  {order.stripeSessionId || "UNSPECIFIED"}
                </p>
              </div>
            </div>
          </div>

          {/* Proof of Delivery Card */}
          <div className={`
            group rounded-3xl p-6 border transition-all duration-500 flex flex-col justify-between
            ${order.deliveryProof ? 'bg-white border-slate-100' : 'bg-amber-50/50 border-amber-200/50'}
          `}>
            <div className="space-y-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                order.deliveryProof ? 'bg-slate-50 text-slate-300 group-hover:bg-[#0F172A] group-hover:text-[#22C55E]' : 'bg-amber-100 text-amber-500'
              }`}>
                {order.deliveryProof ? <Globe className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] font-black uppercase tracking-widest ${order.deliveryProof ? 'text-slate-400' : 'text-amber-600'}`}>
                  {order.deliveryProof ? 'Verified Proof' : 'Awaiting Proof'}
                </p>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">
                  {order.deliveryProof ? 'Merchant has submitted verifiable delivery metadata.' : 'Seller must submit tracking proof before release.'}
                </p>
              </div>
            </div>

            {order.deliveryProof && (
              <a 
                href={order.deliveryProof.startsWith("http") ? order.deliveryProof : `https://${order.deliveryProof}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 h-10 bg-slate-900 group-hover:bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
              >
                <span>Insure</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Audit Ledger Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase italic">Ledger Synchronization</h2>
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Read Only Audit Trail</span>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#22C55E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-5 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Time</th>
                    <th className="text-left py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Class</th>
                    <th className="text-left py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Liquidity Path</th>
                    <th className="text-right py-5 pr-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Array.isArray(ledgerEntries) && ledgerEntries.map((entry, idx) => (
                    <tr 
                      key={entry.id} 
                      className="group/row hover:bg-slate-50/80 transition-colors"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="py-6 pl-10 font-mono text-[11px] font-bold text-slate-400 group-hover/row:text-[#0F172A] transition-colors">
                        {format(entry.createdAt, "MMM d, HH:mm:ss")}
                      </td>
                      <td>
                        <Badge className={`
                          border-0 shadow-none text-[9px] font-black uppercase tracking-tighter px-2 h-5 rounded-md
                          ${entry.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                        `}>
                          {entry.type}
                        </Badge>
                      </td>
                      <td className="py-6 text-xs font-bold text-slate-600 italic">
                        {entry.description}
                      </td>
                      <td className="py-6 pr-10 text-right">
                        <span className={`text-lg font-black tracking-tighter tabular-nums ${entry.type === "CREDIT" ? "text-[#22C55E]" : "text-[#0F172A]"}`}>
                          {entry.type === "CREDIT" ? "+" : "-"}${(entry.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {(!ledgerEntries || ledgerEntries.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <AlertCircle className="w-8 h-8 text-slate-100" />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No financial movements detected</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Auditor Footer */}
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-10 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Protocol v2.1.4</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.3em]">Sovereign Interface</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
