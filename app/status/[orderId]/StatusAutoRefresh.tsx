"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";

interface StatusAutoRefreshProps {
  status: string;
}

export function StatusAutoRefresh({ status }: StatusAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    // Only poll if the status is INITIATED
    if (status !== OrderStatus.INITIATED) return;

    const intervalId = setInterval(() => {
      // Trigger a re-fetch of the current page data
      router.refresh();
      console.log("[StatusSync] Polling for Escrow state...");
    }, 3000);

    return () => clearInterval(intervalId);
  }, [status, router]);

  return null; // This is a headless logic component
}
