"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Zap, Globe, Lock, CheckCircle, Download, X, Settings, FolderInput } from "lucide-react";

export default function LandingPage() {
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-emerald-500/30">
      {/* Installation Modal */}
      {showInstallGuide && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setShowInstallGuide(false)}
        >
          <div 
            className="bg-[#1e293b] border border-emerald-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(5,150,105,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-emerald-600/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Download className="text-white w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Installation Guide</h3>
              </div>
              <button 
                onClick={() => setShowInstallGuide(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-8 h-8 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {[
                { step: 1, title: "Open Extensions", desc: "Open chrome://extensions in your browser" },
                { step: 2, title: "Enable Dev Mode", desc: "Turn on 'Developer mode' in the top right" },
                { step: 3, title: "Load Unpacked", desc: "Click 'Load unpacked' and select our folder" }
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white mb-1">{item.title}</p>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-900">
              <button 
                onClick={() => setShowInstallGuide(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl text-lg"
              >
                I've Loaded the Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TrustEscrow <span className="text-emerald-500">Anywhere</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <button 
              onClick={() => {
                console.log("Install button clicked");
                setShowInstallGuide(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              Add to Chrome
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Now supporting 1M+ online stores</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
            Secure Any Purchase. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">On Every Website.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The first browser extension that brings Stripe-grade escrow protection to any store on the internet. No permission required from the merchant.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => {
                console.log("Hero Install button clicked");
                setShowInstallGuide(true);
              }}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              Add to Chrome — It's Free
            </button>
            <Link href="#how-it-works" className="w-full md:w-auto px-10 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold text-lg">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-20 border-y border-white/5 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center justify-center text-2xl font-bold italic">Amazon</div>
            <div className="flex items-center justify-center text-2xl font-bold italic">Shopify</div>
            <div className="flex items-center justify-center text-2xl font-bold italic">eBay</div>
            <div className="flex items-center justify-center text-2xl font-bold italic">Boutique</div>
          </div>
        </div>
      </section>

      {/* The Guide - How it Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">One Tool. Three Steps.</h2>
            <p className="text-slate-400">Escrow protection simplified for the modern web.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Install the Extension",
                desc: "Add TrustEscrow to your Chrome browser. Our badge will appear on every product page automatically.",
                icon: <Download className="w-8 h-8 text-emerald-400" />
              },
              {
                step: "02",
                title: "Shop & Secure",
                desc: "Click 'Secure with TrustEscrow' on any product. We hold your funds in a secure vault via Stripe.",
                icon: <Lock className="w-8 h-8 text-emerald-400" />
              },
              {
                step: "03",
                title: "Confirm & Release",
                desc: "Use your single-use virtual card to pay the store. Release funds from your dashboard only when the item arrives.",
                icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-all">
                <div className="text-7xl font-black text-white/5 absolute top-4 right-8">{item.step}</div>
                <div className="mb-6 w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Built for the <br />"Anywhere" Economy.</h2>
              <div className="space-y-8">
                {[
                  { title: "Universal Compatibility", desc: "Works on Amazon, eBay, Shopify, and even local boutique stores.", icon: <Globe className="w-6 h-6 text-emerald-400" /> },
                  { title: "Virtual Payment Cards", desc: "Generate single-use cards for every transaction to keep your real card private.", icon: <Shield className="w-6 h-6 text-emerald-400" /> },
                  { title: "One-Click Release", desc: "Manage all your pending escrow payments from a single dashboard.", icon: <Zap className="w-6 h-6 text-emerald-400" /> }
                ].map((f, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{f.title}</h4>
                      <p className="text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-slate-800 rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto flex items-center justify-center animate-pulse mb-4">
                    <Shield className="text-white w-8 h-8" />
                  </div>
                  <div className="text-emerald-400 font-mono text-sm tracking-widest">SYSTEM ACTIVE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white">TrustEscrow</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 TrustEscrow Global. Powered by Stripe.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-emerald-400">Terms</a>
            <a href="#" className="hover:text-emerald-400">Privacy</a>
            <a href="#" className="hover:text-emerald-400">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
