"use client";

import { motion } from "framer-motion";
import { BrainCircuit, FileCode2, ShieldCheck, Network, Zap, Layers } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Decision Making",
    description: "Contracts utilize multi-LLM consensus protocols to resolve subjective conditions, query natural language data, and make intelligent validations autonomously.",
    color: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: FileCode2,
    title: "Intelligent Contracts",
    description: "Write contracts in standard programming languages that can interact with APIs, read websites, interpret documents, and make logic-based evaluations.",
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Transparent",
    description: "Decentralized consensus verification prevents individual LLM bias and ensures execution is verifiable and audit-logged on the blockchain.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Network,
    title: "Decentralized Architecture",
    description: "Operated by a globally distributed set of validator nodes checking outputs, executing logic, and validating results without centralized single-points-of-failure.",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Zap,
    title: "Fast Transactions",
    description: "Optimized virtual machine executes code in milliseconds, submitting fast consensus requests to node verifiers and completing blocks with minimal lag.",
    color: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Layers,
    title: "Cross-Chain Ready",
    description: "Integrate seamlessly with Ethereum, Solana, and other major chains via state-proof bridges, supplying intelligence directly to external dApps.",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
} as const;

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-dark-bg">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full radial-glow-cyan pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Core Features</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Next-Gen Capabilities for Intelligent Web3
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              GenLayer merges blockchain decentralization with the reasoning power of Artificial Intelligence to introduce a new breed of autonomous applications.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="glass-panel rounded-3xl p-8 glow-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              >
                {/* Icon Container with subtle gradient */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center border border-white/10 mb-6 shadow-md`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h4 className="font-display text-xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
