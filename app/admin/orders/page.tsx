import { orderRepo } from "@/repositories/order.repo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Wallet,
  ArrowRight,
  Search,
  Hash
} from "lucide-react";
import Link from "next/link";
import { AdminOrderFilters } from "@/components/admin/AdminOrderFilters";
import { SyncButton } from "@/components/admin/SyncButton";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;
  const status = typeof params.status === 'string' ? params.status : "ALL";
  
  const { orders, totalCount, totalPages, currentPage } = await orderRepo.findAll({
    page,
    limit: 10,
    status
  });

  const getPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (status !== "ALL") sp.set("status", status);
    sp.set("page", p.toString());
    return `/admin/orders?${sp.toString()}`;
  };

  // Derived stats for the visual cards
  const totalVolume = orders.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 antialiased selection:bg-[#22C55E]/20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg shadow-[#0F172A]/20">
                <ShieldCheck className="text-[#22C55E] w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#0F172A]/40 tracking-[0.2em] uppercase">Control Center</span>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight leading-none">Order Forge</h1>
              </div>
            </div>
            <p className="text-slate-500 font-medium max-w-md">Orchestrate secure escrow transactions and manage payment lifecycles with absolute precision.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <SyncButton />
            <AdminOrderFilters />
            <div className="h-12 w-[1px] bg-slate-200 hidden md:block mx-1" />
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#22C55E] to-[#10B981] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative h-12 px-6 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-3 text-[#0F172A] shadow-sm">
                <Wallet className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs font-bold uppercase tracking-wider">{totalCount} Operations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-1000 fill-mode-both">
          <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#22C55E]/50 transition-all duration-500 overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-[#22C55E]/10 transition-colors duration-500" />
            <div className="relative space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="text-slate-400 group-hover:text-[#22C55E] w-6 h-6 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Volume</p>
                <p className="text-3xl font-black text-[#0F172A] tracking-tighter">${(totalVolume / 100).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-500 overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-amber-50 transition-colors duration-500" />
            <div className="relative space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Clock className="text-slate-400 group-hover:text-amber-500 w-6 h-6 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-black text-[#0F172A] tracking-tighter">{orders.filter(o => o.status !== 'RELEASED').length}</p>
                  <span className="text-xs font-bold text-amber-500/80">Awaiting Action</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-[#0F172A] p-6 rounded-3xl border border-[#0F172A] shadow-xl hover:shadow-2xl hover:shadow-[#22C55E]/10 transition-all duration-500 overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#22C55E]/10 rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#22C55E] transition-all duration-500">
                <CheckCircle2 className="text-[#22C55E] group-hover:text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Settlement Rate</p>
                <p className="text-3xl font-black text-white tracking-tighter">100% Secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Ledger Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Transaction Ledger</span>
            <span>Real-time Sync</span>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#22C55E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-16 pl-10">Order Hash</TableHead>
                    <TableHead className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-16">Participant</TableHead>
                    <TableHead className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-16">Escrow Liquidity</TableHead>
                    <TableHead className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-16">Sovereign State</TableHead>
                    <th className="text-right py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-16 pr-10 min-w-[120px]">Verification</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow 
                      key={order.id}
                      className="group/row hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-50"
                    >
                      <TableCell className="py-6 text-center pl-10">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-hover/row:bg-[#0F172A] group-hover/row:text-[#22C55E] transition-all">
                            <Hash className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400 group-hover/row:text-[#0F172A] transition-colors">{order.id.slice(0, 18)}...</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-[#0F172A] tracking-tight">{order.buyerEmail}</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Verified Principal</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-[#0F172A] tracking-tighter tabular-nums">
                            ${(order.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-6 text-center">
                        <div className="flex justify-center">
                          <Badge 
                            variant="outline" 
                            className={`
                              border-0 shadow-none text-[9px] h-6 px-3 font-black uppercase tracking-widest rounded-full flex items-center gap-1.5
                              ${order.status === "INITIATED" ? "bg-amber-100 text-amber-700" : ""}
                              ${order.status === "FUNDS_HELD" ? "bg-blue-100 text-blue-700 font-bold shadow-sm shadow-blue-500/10" : ""}
                              ${order.status === "RELEASED" ? "bg-[#22C55E]/10 text-[#22C55E] font-bold" : ""}
                            `}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'RELEASED' ? 'bg-[#22C55E]' : order.status === 'FUNDS_HELD' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                            {order.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell className="py-6 pr-10 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button className="h-10 px-5 bg-slate-50 hover:bg-[#0F172A] text-[#0F172A] hover:text-[#22C55E] border border-slate-100 hover:border-[#0F172A] rounded-xl font-bold transition-all duration-300 group/btn">
                            <span className="text-[10px] uppercase tracking-widest">Examine</span>
                            <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}

                  {orders.length === 0 && (
                    <TableRow>
                      <td colSpan={5} className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Search className="w-8 h-8" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#0F172A]">No signals detected</h4>
                            <p className="text-slate-400 font-medium text-sm">Clear your filters or initialize a new escrow order.</p>
                          </div>
                        </div>
                      </td>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/0 via-[#22C55E]/5 to-[#22C55E]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {currentPage > 1 ? (
                    <PaginationPrevious href={getPageUrl(currentPage - 1)} className="hover:bg-[#0F172A] hover:text-[#22C55E] transition-colors rounded-xl font-bold border-0" />
                  ) : (
                    <Button variant="ghost" disabled className="pl-1.5 opacity-30 px-3 cursor-not-allowed">Previous</Button>
                  )}
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href={getPageUrl(pageNum)} 
                          isActive={pageNum === currentPage}
                          className={`
                            rounded-xl font-black w-10 h-10 border-0 transition-all duration-300
                            ${pageNum === currentPage ? "bg-[#0F172A] text-[#22C55E] shadow-xl" : "hover:bg-slate-100"}
                          `}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>;
                  }
                  return null;
                })}

                <PaginationItem>
                  {currentPage < totalPages ? (
                    <PaginationNext href={getPageUrl(currentPage + 1)} className="hover:bg-[#0F172A] hover:text-[#22C55E] transition-colors rounded-xl font-bold border-0" />
                  ) : (
                    <Button variant="ghost" disabled className="pr-1.5 opacity-30 px-3 cursor-not-allowed">Next</Button>
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Global Auditor Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-8 border-t border-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">&copy; 2026 Sovereign Escrow Protocol</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-[0.2em] animate-pulse">Encryption Active</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#0F172A] cursor-pointer transition-colors uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              <span>Full Security Audit Completed</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
