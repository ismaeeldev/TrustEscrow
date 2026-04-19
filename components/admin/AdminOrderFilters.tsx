"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function AdminOrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const statuses = ["ALL", "INITIATED", "PAYMENT_PENDING", "FUNDS_HELD", "RELEASED", "FAILED"];

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1"); // Reset page on new filter
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 font-medium gap-2">
          <ListFilter className="w-4 h-4" /> 
          Filter Status
          {currentStatus !== "ALL" && (
            <Badge className="ml-2 bg-[#0F172A] text-white hover:bg-[#0F172A] border-0">{currentStatus}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 rounded-xl" align="end">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5">Filter by Status</p>
          <div className="flex flex-col gap-1">
            {statuses.map((status) => (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                className={`justify-start text-xs font-semibold ${
                  currentStatus === status ? "bg-slate-100 text-[#0F172A]" : "text-slate-600"
                }`}
                onClick={() => handleStatusChange(status)}
              >
                {status.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
