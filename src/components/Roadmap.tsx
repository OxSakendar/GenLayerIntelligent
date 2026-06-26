"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDot, Calendar, Award } from "lucide-react";

const milestones = [
  {
    phase: "Phase 01",
    title: "MVP Release",
    status: "Completed",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: CheckCircle2,
    description: "Launch prototype GenLayer Virtual Machine (GVM) and test core Python intelligent contract compilers. Validate multi-LLM node consensus locally.",
    date: "Q4 2025",
    bullets: [
      "Core GVM engine implementation",
      "Python contract compiler prototype",
      "Local multi-model verification suite",
    ],
  },
  {
    phase: "Phase 02",
    title: "Testnet Launch",
    status: "In Progress",
    statusColor: "text-secondary bg-secondary/10 border-secondary/20",
    icon: CircleDot,
    description: "Deploy public testnet. Invite decentralized nodes to validate consensus. Publish SDK and developer sandbox environment.",
    date: "Q2 2026",
    bullets: [
      "Public testnet network setup",
      "Developer portal & playground launch",
      "Validator node staking mechanics testing",
    ],
  },
  {
    phase: "Phase 03",
    title: "Mainnet Release",
    status: "Q3 2026",
    statusColor: "text-gray-400 bg-white/5 border-white/10",
    icon: Calendar,
    description: "Full production ledger launch. Staking mechanisms activated. Dynamic gas pricing model. Cross-chain state-relayer integration.",
    date: "Q3 2026",
    bullets: [
      "Staking pools and validator onboarding",
      "Sub-cent gas pricing optimization",
      "Direct EVM & SVM oracle state bridge",
    ],
  },
  {
    phase: "Phase 04",
    title: "Ecosystem Expansion",
    status: "Q4 2026",
    statusColor: "text-gray-400 bg-white/5 border-white/10",
    icon: Award,
    description: "Incubate initial dApps (parametric insurance, AI prediction markets, decentralized arbitration). Implement advanced multi-modal verifiers.",
    date: "Q4 2026",
    bullets: [
      "Developer grant program launch",
      "Support for multi-modal (image/voice) validators",
      "DAO-managed node operator approvals",
    ],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 relative overflow-hidden bg-dark-bg/40 border-t border-b border-white/5">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full radial-glow pointer-events-none opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Timeline</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Development Roadmap
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Follow our milestones as we transition from initial prototype tests to a fully decentralized production environment.
            </p>
          </motion.div>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, idx) => {
            const Icon = milestone.icon;
            const isInProgress = milestone.status === "In Progress";
            const isCompleted = milestone.status === "Completed";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`glass-panel rounded-3xl p-6 glow-card transition-all flex flex-col justify-between h-full relative ${
                  isInProgress ? "border-secondary/40 shadow-lg shadow-secondary/5" : ""
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-primary-dark uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      {milestone.phase}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${milestone.statusColor}`}>
                      {milestone.status}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${
                      isCompleted ? "bg-emerald-500/10 text-emerald-400" : isInProgress ? "bg-secondary/10 text-secondary" : "bg-white/5 text-gray-500"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-white tracking-tight">{milestone.title}</h4>
                      <p className="text-[10px] text-gray-500 font-semibold">{milestone.date}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs leading-relaxed mb-6">
                    {milestone.description}
                  </p>
                </div>

                {/* Bullets */}
                <div className="border-t border-white/5 pt-4 mt-auto">
                  <ul className="space-y-2">
                    {milestone.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-[11px] text-gray-500">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isCompleted ? "bg-emerald-500/50" : isInProgress ? "bg-secondary/50" : "bg-gray-600"
                        }`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
