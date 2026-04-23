import { ShieldCheck, ArrowRight, ShieldIcon, Zap, Globe, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function Home() {
   return (
      <div className="flex flex-col min-h-screen bg-[#0F172A] text-white selection:bg-[#22C55E]/30 antialiased overflow-x-hidden">
         {/* Hero Section */}
         <header className="relative w-full h-screen flex flex-col items-center justify-center px-4 overflow-hidden border-b border-white/5">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[120px] animate-pulse" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
            </div>

            <Navbar />

            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
               <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#22C55E] tracking-widest uppercase mb-4 shadow-xl">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Next-Gen Escrow Logic</span>
               </div>

               <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
                  Secure Payments <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-emerald-400">
                     Without Friction.
                  </span>
               </h1>

               <p className="max-w-xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                  The world's most secure hold-and-release infrastructure for online transactions.
                  Protecting Buyers and Sellers with immutable audit trails.
               </p>

               <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center">
                  <Button
                     asChild
                     className="!bg-[#22C55E] hover:!bg-[#16A34A] !text-slate-900 
  h-16 px-10 font-black rounded-2xl shadow-2xl shadow-[#22C55E]/20 
  transition-all text-lg group border-0 hover:translate-y-[-4px] hover:shadow-[#22C55E]/40"
                  >
                     <Link href="/admin/orders" className="flex items-center">
                        <span>Access Dashboard</span>
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                     </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 px-10 !bg-white/5 backdrop-blur-xl border-white/10 !text-white hover:!bg-white/10 hover:!text-white font-bold rounded-2xl transition-all text-lg group hover:translate-y-[-4px]">
                     <Link href="/onboard" className="flex items-center justify-center">
                        <Globe className="w-5 h-5 mr-2 opacity-60 group-hover:rotate-12 transition-transform" />
                        <span>Join as Seller</span>
                     </Link>
                  </Button>
               </div>
            </div>

            <div className="absolute bottom-12 animate-bounce opacity-20">
               <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent rounded-full" />
            </div>
         </header>

         {/* Trust Section */}
         <section id="features" className="py-32 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
               <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for Total Security</h2>
                  <p className="max-w-2xl mx-auto text-slate-400 font-medium text-lg">
                     Every transaction is backed by a multi-layered verification process and automated blockchain-inspired ledger entries.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     {
                        title: "Funds Held",
                        desc: "Payments are captured via Stripe and held in our secure escrow vault until delivery is confirmed.",
                        icon: Lock,
                        color: "text-blue-400"
                     },
                     {
                        title: "Proof Validation",
                        desc: "Sellers must provide verified delivery proof (tracking, file hash, or service logs) for admin review.",
                        icon: ShieldIcon,
                        color: "text-[#22C55E]"
                     },
                     {
                        title: "Instant Release",
                        desc: "Once validated, funds are instantly transferred to the seller's connected account via Stripe Connect.",
                        icon: Zap,
                        color: "text-amber-400"
                     }
                  ].map((feature, i) => (
                     <div key={i} className="group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] hover:bg-white/[0.08] transition-all hover:-translate-y-2 duration-500">
                        <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                           <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Verification Steps Section */}
         <section id="security" className="py-32 bg-white/5 border-y border-white/5">
            <div className="max-w-5xl mx-auto px-4">
               <div className="bg-[#0F172A] border border-white/10 rounded-[60px] p-12 md:p-24 shadow-3xl text-center flex flex-col items-center space-y-12">
                  <div className="w-24 h-24 bg-[#22C55E]/20 text-[#22C55E] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                     <ShieldCheck className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">Zero Fraud Tolerance.</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 text-left w-full max-w-2xl px-4">
                     {[
                        "End-to-End Encryption",
                        "Automated Audit Trail",
                        "Manual Admin Verification",
                        "Stripe-Powered Compliance",
                        "Immutable Ledger Logs",
                        "Multi-Currency Support"
                     ].map((text, i) => (
                        <div key={i} className="flex items-center space-x-3 group">
                           <CheckCircle className="w-5 h-5 text-[#22C55E] group-hover:scale-125 transition-transform" />
                           <span className="font-bold text-slate-300">{text}</span>
                        </div>
                     ))}
                  </div>

                  <Button
                     asChild
                     className="h-16 px-12 !bg-white !text-slate-950 
  hover:!bg-slate-100 hover:!text-slate-950 
  font-black rounded-2xl transition-all shadow-xl 
  hover:translate-y-[-4px] hover:shadow-white/20 border-0"
                  >
                     <Link href="/onboard" className="flex items-center justify-center">
                        Start Your First Escrow Order
                     </Link>
                  </Button>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="py-20 px-8 border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
               <div className="space-y-6 max-w-sm">
                  <div className="flex items-center space-x-2">
                     <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
                     <span className="text-lg font-bold">TrustEscrow</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium font-mono leading-relaxed">
                     Advanced financial infrastructure for modern digital commerce. Built on the principle of maximum trust through immutable logic.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                     <div className="flex items-center gap-2 px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">Protocol Nominal</span>
                     </div>
                     <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">v2.1.4-Stable</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <Link href="/admin/orders" className="hover:text-white transition-colors group flex items-center gap-2">
                     <span>Forge Ledger</span>
                     <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                  <Link href="/onboard" className="hover:text-white transition-colors">Seller Portal</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Privacy</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
               </div>

               <div className="space-y-4 text-center md:text-right">
                  <div className="text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase">
                     &copy; 2026 TrustEscrow Systems Logic
                  </div>
                  <div className="flex items-center justify-center md:justify-end gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl opacity-40">
                     <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
                     <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Certified Production Environment</span>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}
