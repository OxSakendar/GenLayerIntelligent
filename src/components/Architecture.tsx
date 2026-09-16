"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Globe, Server, Code, BrainCircuit, HardDriveDownload, ArrowRight } from "lucide-react";

const stages = [
  {
    id: "party",
    title: "Buyer / Seller",
    icon: User,
    color: "from-purple-500 to-indigo-500",
    shadow: "shadow-purple-500/20",
    details: {
      headline: "Buyer / Seller Party",
      role: "Initiates escrow, deposits funds, or submits dispute evidence.",
      code: `{
  "role": "BUYER",
  "action": "open_dispute",
  "buyer_evidence": "Deliverable missing security audit logs and required endpoints."
}`,
      explanation: "Escrow participants deposit funds, submit work completion proofs, or open disputes when deliverables differ from agreed terms."
    }
  },
  {
    id: "frontend",
    title: "SmartEscrow DApp",
    icon: Globe,
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
    details: {
      headline: "SmartEscrow Web3 DApp",
      role: "Submits transactions directly to GenLayer Studio Next RPC.",
      code: `const tx = await executeSmartEscrowWrite(
  "resolve_dispute_with_ai",
  [],
  "0",
  CONTRACT_ADDRESS
);
console.log("Transaction Hash:", tx.txHash);`,
      explanation: "Direct client interface connecting Web3 wallets straight to the GenLayer Studio Next network without central backend API intermediaries."
    }
  },
  {
    id: "contract",
    title: "Intelligent Contract",
    icon: Code,
    color: "from-cyan-500 to-teal-500",
    shadow: "shadow-cyan-500/20",
    details: {
      headline: "SmartEscrow Intelligent Contract",
      role: "Executes state machine rules and calls gl.eq_principle.",
      code: `class SmartEscrow(gl.Contract):
    def resolve_dispute_with_ai(self) -> str:
        ruling = gl.eq_principle.prompt_non_comparative(
            build_prompt,
            task="Analyse evidence and return JSON with ruling.",
            criteria="..."
        )
        self.dispute_ruling = ruling
        return ruling`,
      explanation: "Python contract running on GenLayer VM. Executes access controls and invokes non-comparative LLM consensus during dispute execution."
    }
  },
  {
    id: "judgment",
    title: "Decentralized Judgment",
    icon: BrainCircuit,
    color: "from-cyan-500 to-emerald-500",
    shadow: "shadow-cyan-500/20",
    details: {
      headline: "GenLayer Decentralized Judgment",
      role: "Multi-LLM validator nodes evaluate evidence in parallel.",
      code: `// Independent Validator Node Outputs:
- Node 1 (Claude 3.5): "Ruling: BUYER. Reasoning: Logs absent."
- Node 2 (GPT-4o):     "Ruling: BUYER. Reasoning: Audit log missing."
- Node 3 (Llama 3):    "Ruling: BUYER. Reasoning: Incomplete submission."

Consensus Result: 3/3 Votes -> BUYER Ruling Validated`,
      explanation: "Validator nodes execute independent LLMs and check output against semantic criteria. Transaction finalizes only upon consensus."
    }
  },
  {
    id: "ruling",
    title: "Consensus Ruling",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
    details: {
      headline: "Onchain Stored Ruling",
      role: "Cryptographically commits ruling into persistent contract state.",
      code: `{
  "state": "DISPUTED",
  "dispute_ruling": "{\\"ruling\\": \\"BUYER\\", \\"reasoning\\": \\"Evidence confirms missing deliverables.\\"}",
  "validated_onchain": true
}`,
      explanation: "The AI judgment is stored in the smart contract's state, preventing tampering or unauthorized modification."
    }
  },
  {
    id: "settlement",
    title: "Automated Settlement",
    icon: HardDriveDownload,
    color: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/20",
    details: {
      headline: "Trustless Onchain Settlement",
      role: "Transfers escrowed funds according to validated ruling.",
      code: `def execute_ruling(self):
    if self.ruling_winner == "BUYER":
        self.state = STATE_RESOLVED_BUYER
        emit_transfer(self.buyer, self.amount)`,
      explanation: "Executes final settlement onchain, returning funds to the buyer or releasing payment to the seller based on the validated ruling."
    }
  }
];

export default function Architecture() {
  const [activeStageIdx, setActiveStageIdx] = useState(4); // AI Verification default active
  const activeStage = stages[activeStageIdx];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden bg-dark-bg">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-10"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full radial-glow-cyan pointer-events-none opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">System Architecture</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              The Intelligent Workflow Pipeline
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Explore how requests flow seamlessly through our infrastructure, utilizing multi-LLM consensus to process intelligent logic.
            </p>
          </motion.div>
        </div>

        {/* Interactive Diagram Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Top: Interactive Pipeline Flow (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center glass-panel rounded-3xl p-6 sm:p-8">
            <h4 className="font-display text-lg font-semibold text-gray-300 mb-8 flex items-center gap-2">
              <span>Interactive Pipeline Diagram</span>
              <span className="text-xs font-medium bg-secondary/15 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full">Click any node</span>
            </h4>

            {/* Pipeline grid/path */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 relative">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = idx === activeStageIdx;

                return (
                  <div key={stage.id} className="relative flex flex-col items-center">
                    
                    {/* Floating Pulse between nodes (Desktop only path connectors helper) */}
                    {idx < stages.length - 1 && (
                      <div className="hidden md:block absolute top-[28px] left-[calc(50%+45px)] w-[calc(100%-90px)] h-0.5 bg-gradient-to-r from-white/10 to-white/10 pointer-events-none z-0">
                        {isActive && (
                          <motion.div
                            initial={{ left: "-10%" }}
                            animate={{ left: "110%" }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary blur-xs"
                          />
                        )}
                      </div>
                    )}

                    {/* Node Circle */}
                    <button
                      onClick={() => setActiveStageIdx(idx)}
                      className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-tr ${stage.color} text-white scale-110 shadow-lg ${stage.shadow}`
                          : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Icon className="w-7 h-7" />

                      {/* Small number indicator */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-dark-bg border border-white/10 text-[10px] font-bold flex items-center justify-center text-gray-400">
                        {idx + 1}
                      </span>
                    </button>

                    {/* Node Title */}
                    <p className={`text-sm font-medium mt-3 transition-colors ${isActive ? "text-white font-semibold" : "text-gray-400"}`}>
                      {stage.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Horizontal flow direction visual helper */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">Request phase <ArrowRight className="w-3.5 h-3.5" /></span>
              <span className="flex items-center gap-1">Consensus check <ArrowRight className="w-3.5 h-3.5" /></span>
              <span className="flex items-center gap-1">Finalized ledger</span>
            </div>
          </div>

          {/* Right / Bottom: Details Inspector Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
            {/* Ambient card highlight */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-tr ${activeStage.color} blur-3xl opacity-10 pointer-events-none`} />

            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10`}>
                  Stage {activeStageIdx + 1} of 6
                </span>
                <span className="text-xs text-gray-500 font-medium">Pipeline Stage</span>
              </div>

              {/* Title */}
              <h4 className="font-display text-2xl font-bold text-white mb-2">
                {activeStage.details.headline}
              </h4>
              <p className="text-secondary text-sm font-medium mb-4">
                {activeStage.details.role}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {activeStage.details.explanation}
              </p>
            </div>

            {/* Code / Debugger Console Output */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                System Console Data
              </p>
              <div className="relative rounded-xl overflow-hidden bg-black/60 border border-white/5 font-mono text-[11px] leading-normal p-4 text-gray-300 shadow-inner">
                <div className="absolute top-2 right-3 text-[9px] text-gray-600 font-sans font-bold uppercase tracking-widest">
                  JSON / Code
                </div>
                <pre className="overflow-x-auto max-h-[160px] whitespace-pre-wrap scrollbar-thin">
                  {activeStage.details.code}
                </pre>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
