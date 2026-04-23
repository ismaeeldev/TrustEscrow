"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl flex items-center justify-between p-8 z-50">
      <Link href="/" className="flex items-center space-x-2 group">
        <ShieldCheck className="w-8 h-8 text-[#22C55E] group-hover:scale-110 transition-transform" />
        <span className="text-xl font-bold tracking-tight text-white">TrustEscrow</span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
        <Link 
          href={isHome ? "#features" : "/#features"} 
          className="hover:text-white transition-all hover:translate-y-[-1px]"
        >
          Features
        </Link>
        <Link 
          href={isHome ? "#security" : "/#security"} 
          className="hover:text-white transition-all hover:translate-y-[-1px]"
        >
          Security
        </Link>
        <Link 
          href="/onboard" 
          className="hover:text-white transition-all hover:translate-y-[-1px]"
        >
          Join as Seller
        </Link>
        <Link 
          href="/seller-guide" 
          className={`transition-all hover:translate-y-[-1px] ${pathname === '/seller-guide' ? 'text-[#22C55E] font-bold' : 'hover:text-white'}`}
        >
          Seller Guide
        </Link>
        <Link 
          href="/integration-guide" 
          className={`transition-all hover:translate-y-[-1px] ${pathname === '/integration-guide' ? 'text-[#22C55E] font-bold' : 'hover:text-white'}`}
        >
          Integration Guide
        </Link>
        <Link 
          href="/terms" 
          className="hover:text-white transition-all hover:translate-y-[-1px]"
        >
          Terms
        </Link>
        <Link 
          href="/admin/login" 
          className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white transition-all"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
