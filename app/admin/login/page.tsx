import { LoginForm } from "./LoginForm";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 antialiased selection:bg-[#22C55E]/30">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl mb-2">
            <ShieldCheck className="text-[#22C55E] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm font-medium">Secure access to TrustEscrow management</p>
        </div>

        <Suspense fallback={
          <div className="h-[400px] w-full bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl animate-pulse" />
        }>
          <LoginForm />
        </Suspense>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">
            &copy; 2026 TrustEscrow Systems Logic
          </p>
        </div>
      </div>
    </div>
  );
}
