"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, KeyRound, AlertCircle } from "lucide-react";
import { loginAction } from "./actions";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/orders";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData, from);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Redirect is handled by the server action
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="secret" 
                className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
              >
                Access Secret
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#22C55E] transition-colors">
                  <KeyRound className="w-5 h-5" />
                </div>
                <Input
                  id="secret"
                  name="secret"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium animate-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-[#22C55E] hover:bg-[#1DA850] text-white font-bold rounded-xl shadow-lg shadow-[#22C55E]/10 transition-all active:scale-[0.98] text-lg"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Authorize"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <p className="text-center text-[10px] text-slate-500 font-medium px-4">
        This session will persist for 7 days. Unauthorized access is strictly prohibited.
      </p>
    </div>
  );
}
