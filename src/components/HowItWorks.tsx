"use client";

import { motion } from "framer-motion";
import { Send, Server, Cpu, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Send,
    title: "User Submits Request",
    description: "The workflow starts when a user inputs a query or triggers a transaction on the frontend interface (e.g., requesting a payout based on subjective weather conditions, sports score validations, or document checks).",
    color: "from-purple-500 to-indigo-500",
    glow: "shadow-purple-500/20",
  },
  {
    number: "02",
    icon: Server,
    title: "Frontend Sends Data to Backend",
    description: "The user's request details are securely packaged and sent to the application backend via API calls, preparing the transaction metadata and establishing security contexts.",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
  },
  {
    number: "03",
    icon: Cpu,
    title: "Backend Interacts with GenLayer",
    description: "The backend fires an interaction to the GenLayer Intelligent Contract. The GenLayer Virtual Machine loads the logic, ready to dispatch task evaluations to network consensus validators.",
    color: "from-cyan-500 to-teal-500",
    glow: "shadow-cyan-500/20",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "AI Contract Returns Verified Results",
    description: "Distributed validator nodes query AI models to build consensus on the subjective criteria. Once consensus is reached, the transaction state commits to the blockchain and returns verified, tamper-proof outputs.",
    color: "from-emerald-500 to-green-500",
    glow: "shadow-emerald-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-dark-bg/50 border-t border-b border-white/5">
      {/* Background gradients */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full radial-glow-blue pointer-events-none opacity-20"></div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full radial-glow pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Process</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Discover the lifecycle of an AI-driven transaction from submission to decentralized consensus verification.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Central Line (Desktop Only) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-blue-500 to-emerald-500 opacity-20 hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-center">
                  
                  {/* Step Card Container */}
                  <div className={`w-full md:w-1/2 flex ${isEven ? "md:justify-end md:pr-16" : "md:justify-start md:pl-16 order-1 md:order-2"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                      className="glass-panel rounded-3xl p-8 max-w-lg glow-card relative z-10"
                    >
                      {/* Step Number Badge */}
                      <span className={`absolute top-6 right-8 font-display text-4xl font-extrabold opacity-10 bg-clip-text text-white`}>
                        {step.number}
                      </span>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-tr ${step.color} text-white shadow-lg ${step.glow}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-display text-xl font-bold text-white tracking-tight">
                          {step.title}
                        </h4>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Centered Node / Pulse Indicator */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center z-20 order-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 100, delay: 0.1 }}
                      className="w-10 h-10 rounded-full bg-dark-bg border-2 border-white/10 flex items-center justify-center group"
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${step.color} shadow-lg ${step.glow} group-hover:scale-125 transition-transform`} />
                    </motion.div>
                  </div>

                  {/* Spacer (Desktop Only) */}
                  <div className="w-full md:w-1/2 hidden md:block order-3" />

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
