import { orderRepo } from "@/repositories/order.repo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { env } from "@/config/env";
import { ShieldCheck, Eye, ListFilter } from "lucide-react";
import Link from "next/link";
import { AdminOrderFilters } from "@/components/admin/AdminOrderFilters";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await search params for Next.js 15+ compatibility
  const params = await searchParams;
  
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;
  const status = typeof params.status === 'string' ? params.status : "ALL";
  
  // 1. Fetch filtered and paginated orders
  const { orders, totalCount, totalPages, currentPage } = await orderRepo.findAll({
    page,
    limit: 10,
    status
  });

  // Calculate generic filter URLs for pagination
  const getPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (status !== "ALL") sp.set("status", status);
    sp.set("page", p.toString());
    return `/admin/orders?${sp.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#0F172A] rounded flex items-center justify-center">
                <ShieldCheck className="text-[#22C55E] w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] tracking-widest uppercase">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Order Review</h1>
            <p className="text-sm text-slate-500 font-medium">Monitoring and managing all active escrow transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <AdminOrderFilters />
            <div className="h-10 px-4 bg-[#22C55E] rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#22C55E]/10">
              {totalCount} Total Orders
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white flex flex-col min-h-[600px]">
          <div className="flex-1">
            <Table>
              <TableHeader className="bg-[#0F172A]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-14 pl-8">Order ID</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-14">Buyer Email</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-14">Amount</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-14">Status</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-14 text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-[11px] text-slate-500 pl-8 py-6">
                      {order.id.substring(0, 13)}...
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700 text-sm">
                      {order.buyerEmail}
                    </TableCell>
                    <TableCell className="font-bold text-[#0F172A] text-sm">
                      ${(order.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`
                          ${order.status === "INITIATED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""}
                          ${order.status === "FUNDS_HELD" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                          ${order.status === "RELEASED" ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20" : ""}
                          px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-0 shadow-none
                        `}
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 text-[#0F172A] transition-all">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                          <ListFilter className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 font-medium">No orders found matching the criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 p-4 bg-slate-50/50">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage > 1 ? (
                      <PaginationPrevious href={getPageUrl(currentPage - 1)} />
                    ) : (
                      <Button variant="ghost" disabled className="pl-1.5 opacity-50 px-3">Previous</Button>
                    )}
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Generic windowing (only show a few nearby pages)
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink href={getPageUrl(pageNum)} isActive={pageNum === currentPage}>
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
                      <PaginationNext href={getPageUrl(currentPage + 1)} />
                    ) : (
                      <Button variant="ghost" disabled className="pr-1.5 opacity-50 px-3">Next</Button>
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
          <span>&copy; TrustEscrow Admin System</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E]" /> Live Audit Mode</span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
