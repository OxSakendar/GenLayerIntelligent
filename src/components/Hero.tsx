"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Shield, Zap } from "lucide-react";
import NetworkBackground from "./NetworkBackground";

const GithubLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="fill-current" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden grid-bg"
    >
      {/* Background Gradients and Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full radial-glow-cyan pointer-events-none opacity-40 animate-pulse-slow"></div>

      {/* Network Animation Canvas */}
      <NetworkBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32 flex flex-col items-center">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md text-xs font-semibold text-primary mb-8"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>GenLayer Studio Next · Chain 61997</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8"
          >
            SmartEscrow
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-secondary text-2xl sm:text-3xl md:text-4xl lg:text-5xl block mt-2">
              Decentralized AI Dispute Resolution for Onchain Escrow
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Resolve buyer-seller disputes with GenLayer decentralized judgment and execute the validated ruling onchain.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="#demo"
              className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden group shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-all group-hover:scale-[1.03] duration-300"></span>
              <span className="relative flex items-center gap-2">
                Launch SmartEscrow <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href="https://explorer-studio-dev.genlayer.com/address/0xb4412590158f0CceEc98ebffAFf99C851Ab6703c"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              View Contract Explorer
            </a>
          </motion.div>
        </div>

        {/* Proof-oriented Features Grid */}
        <div className="w-full max-w-6xl mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Shield,
              title: "Real SmartEscrow Contract",
              desc: "Deployed Intelligent Contract on Chain 61997",
              color: "text-primary",
              delay: 0.4,
            },
            {
              icon: Brain,
              title: "GenLayer Decentralized Judgment",
              desc: "Multi-LLM validator consensus arbitration",
              color: "text-secondary",
              delay: 0.5,
            },
            {
              icon: Zap,
              title: "Onchain Stored Ruling",
              desc: "Cryptographically committed state transition",
              color: "text-accent",
              delay: 0.6,
            },
            {
              icon: Shield,
              title: "Automated Settlement",
              desc: "Trustless execution according to validated outcome",
              color: "text-emerald-400",
              delay: 0.7,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: item.delay }}
              className="glass-panel rounded-2xl p-5 glow-card transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl bg-white/5 ${item.color} shrink-0 mt-0.5`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fade to bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none"></div>
    </section>
  );
}
