"use client";

import { useState } from "react";
import { Cpu, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import LegalModals, { type ModalType } from "./LegalModals";

const GithubLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="fill-current" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="fill-current" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      {/* Legal Modals portal */}
      <LegalModals open={activeModal} onClose={() => setActiveModal(null)} />

      <footer className="bg-black/60 border-t border-white/5 pt-16 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            
            {/* Logo and Description (4 cols) */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary p-[1px]">
                  <div className="flex items-center justify-center w-full h-full rounded-[7px] bg-dark-bg">
                    <Cpu className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  Gen<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Layer</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mb-6">
                GenLayer is the cognitive blockchain layer. We deploy decentralized, multi-LLM consensus protocols to empower autonomous smart contracts with web-search and LLM-reasoning abilities.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: GithubLogo, href: "https://github.com" },
                  { icon: XLogo, href: "https://twitter.com" },
                  { icon: MessageSquare, href: "https://discord.com" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Sitemap (2 cols) */}
            <div className="md:col-span-2">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Sitemap</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#home" className="text-gray-500 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-500 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-500 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#architecture" className="text-gray-500 hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#demo" className="text-gray-500 hover:text-white transition-colors">Console Demo</a></li>
              </ul>
            </div>

            {/* Developers (2 cols) */}
            <div className="md:col-span-2">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Developers</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="https://github.com" className="text-gray-500 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com" className="text-gray-500 hover:text-white transition-colors">Python SDK</a></li>
                <li><a href="https://github.com" className="text-gray-500 hover:text-white transition-colors">GitHub Repository</a></li>
                <li><a href="#roadmap" className="text-gray-500 hover:text-white transition-colors">Network Roadmap</a></li>
              </ul>
            </div>

            {/* Newsletter (4 cols) */}
            <div className="md:col-span-4">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Newsletter</h5>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Get the latest protocol updates, testnet releases, and developer grants straight to your inbox.
              </p>
              {subscribed ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2.5 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Subscription recorded successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="flex-1 bg-black/40 border border-white/10 focus:border-primary/50 outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Footer Bottom (Legal and Copyright) */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-end gap-4 text-[10px] text-gray-600">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveModal("privacy")}
                className="hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModal("terms")}
                className="hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveModal("cookies")}
                className="hover:text-gray-300 transition-colors"
              >
                Cookie Settings
              </button>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
