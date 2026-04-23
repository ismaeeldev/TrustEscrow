import { ShieldCheck, ArrowRight, Zap, Code2, Terminal, Cpu, Webhook, Lock, CheckCircle2, BookOpen, ExternalLink, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function IntegrationGuidePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-white selection:bg-[#22C55E]/30 antialiased overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      <main className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[5%] left-[-10%] w-[800px] h-[800px] bg-[#22C55E]/5 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse [animation-delay:3s]" />
        </div>

        <div className="max-w-5xl mx-auto space-y-20 relative z-10">
          {/* Hero Header */}
          <div className="space-y-6 text-center md:text-left md:flex md:items-center md:gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-4 shadow-xl">
                <Terminal className="w-3.5 h-3.5" />
                <span>Developer Portal v2.0</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl">
                API Integration <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Built for Speed.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                TrustEscrow is an API-First platform. Integrate secure hold-and-release logic into your marketplace, store, or bot in minutes.
              </p>
            </div>
            <div className="hidden lg:block w-72 h-72 bg-white/5 border border-white/10 rounded-[60px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Code2 className="w-32 h-32 text-blue-500/20 group-hover:scale-110 transition-transform duration-700" />
               </div>
            </div>
          </div>

          {/* Architecture Overview */}
          <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
                  <Cpu className="text-blue-400 w-8 h-8" />
                  01. Architecture Overview
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                  We handle the financial complexity. You create an order, redirect your customer to our checkout, and we manage the secure payout logic.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest">Rest API</div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] font-black text-purple-400 uppercase tracking-widest">JSON Payload</div>
              </div>
            </div>
          </section>

          {/* Step 3: Creating an Order */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center font-black">02</div>
              <h2 className="text-3xl font-black tracking-tight">Creating an Escrow Order</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-slate-400 font-medium leading-relaxed">
                  When your customer clicks "Buy Now", your backend calls our create API. We return a secure URL where the buyer performs the payment.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="bg-green-500 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black">POST</span>
                      <code className="text-blue-400 font-mono text-xs">{baseUrl}/api/orders/create</code>
                   </div>
                   <ul className="space-y-3 text-xs text-slate-500 font-medium px-4">
                      <li className="flex items-center gap-2">
                         <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                         <span>Amount must be in cents (5000 = $50.00)</span>
                      </li>
                      <li className="flex items-center gap-2">
                         <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                         <span>Requires valid Seller ID (acct_...)</span>
                      </li>
                   </ul>
                </div>
              </div>

              <div className="bg-[#0F172A] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group">
                <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Request Payload</span>
                  <Copy className="w-3 h-3 text-slate-600 hover:text-white transition-colors cursor-pointer" />
                </div>
                <pre className="p-6 text-xs font-mono text-indigo-300 leading-relaxed overflow-x-auto">
{`{
  "buyer_email": "customer@example.com",
  "amount": 5000, 
  "seller_email": "you@yourdomain.com",
  "seller_stripe_account_id": "acct_1XXXXXXXXXXXX"
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Step 4: Submitting Proof */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center font-black">03</div>
              <h2 className="text-3xl font-black tracking-tight">Submitting Delivery Proof</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0F172A] rounded-3xl border border-white/10 overflow-hidden shadow-2xl order-2 lg:order-1">
                <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Proof API</span>
                  <Terminal className="w-3 h-3 text-slate-600" />
                </div>
                <pre className="p-6 text-xs font-mono text-[#22C55E] leading-relaxed overflow-x-auto">
{`POST /api/orders/{order_id}/submit-proof

{
  "deliveryProof": "https://tracking.fedex.com/id/987..."
}`}
                </pre>
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-slate-400 font-medium leading-relaxed">
                  Notify the system once the service is performed. This triggers the Admin review process for fund release.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[32px] space-y-4">
                  <div className="flex items-center gap-3">
                     <Webhook className="w-5 h-5 text-blue-400" />
                     <h4 className="text-lg font-bold">Automation Tip</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Automate this step by linking your shipping provider's webhooks directly to our Proof API for zero-touch payouts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Webhook Flow Visual */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-white/10 rounded-[60px] p-12 md:p-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-20 opacity-5">
                <Webhook className="w-64 h-64" />
             </div>
             
             <div className="space-y-12 relative z-10">
                <div className="text-center space-y-4">
                   <h2 className="text-4xl font-black tracking-tight italic">E-commerce Webhook Flow</h2>
                   <p className="text-slate-400 font-medium max-w-xl mx-auto">
                      A complete end-to-end lifecycle of a TrustEscrow transaction.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   {[
                      { step: "Trigger", desc: "User checks out on your site" },
                      { step: "Checkout", desc: "Redirect to TrustEscrow Pay" },
                      { step: "Delivery", desc: "You ship and submit proof" },
                      { step: "Payout", desc: "Admin releases funds to you" }
                   ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                         <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all group-hover:scale-110 duration-500">
                            <span className="text-lg font-black text-blue-400">{i + 1}</span>
                         </div>
                         <div className="space-y-1">
                            <h5 className="text-sm font-black uppercase tracking-widest">{item.step}</h5>
                            <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                         </div>
                         {i < 3 && <ArrowRight className="hidden md:block absolute translate-x-32 translate-y-2 opacity-10" />}
                      </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Security Checklist */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
              <Lock className="text-red-400 w-8 h-8" />
              Production Security Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[40px] space-y-4 group hover:bg-red-500/10 transition-colors">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 font-black text-xs">!</div>
                <h4 className="text-xl font-bold text-red-400">Server-Side Only</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Never call the Create API from the browser. Use Node.js, Python, or PHP to prevent tampering with order amounts.
                </p>
              </div>
              <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-[40px] space-y-4 group hover:bg-green-500/10 transition-colors">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-[#22C55E] font-black text-xs">✓</div>
                <h4 className="text-xl font-bold text-[#22C55E]">Configure Webhooks</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Listen for <span className="font-mono text-white/60">FUNDS_HELD</span> events to trigger your shipping workflow automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[60px] p-12 md:p-24 text-white text-center space-y-12 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="relative z-10 space-y-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-3xl group">
                 <Terminal className="w-12 h-12 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Ready to Build?</h2>
                <p className="text-indigo-100 font-bold opacity-80 max-w-md mx-auto text-lg">
                  Join the elite network of developers building on the TrustEscrow protocol.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild className="h-16 px-12 !bg-white !text-slate-900 hover:!bg-slate-100 font-black rounded-2xl transition-all shadow-xl hover:translate-y-[-4px] border-0 text-lg">
                   <Link href="/onboard" className="flex items-center justify-center">Get Your API Key</Link>
                </Button>
                <Button asChild variant="outline" className="h-16 px-12 !bg-transparent border-white/20 !text-white hover:!bg-white/10 font-black rounded-2xl transition-all text-lg">
                   <a href="https://discord.gg/trustescrow" target="_blank" className="flex items-center justify-center">Developer Discord</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Copy */}
          <div className="text-center pt-12 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">
              &copy; 2026 TrustEscrow Dev Portal | Immutable Code. Universal Trust.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
