"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is GenLayer?",
    answer: "GenLayer is a next-generation blockchain architecture designed specifically to execute intelligent contracts. Unlike traditional networks that only process deterministic arithmetic, GenLayer incorporates a decentralized multi-model AI consensus engine directly into its consensus layer, enabling smart contracts to query external web data and evaluate subjective conditions securely.",
  },
  {
    question: "What are Intelligent Contracts?",
    answer: "Intelligent Contracts are smart contracts that can think and interact. Written in standard high-level programming languages like Python, they can query APIs, scrape websites, read PDFs, and evaluate subjective, fuzzy, or conditional language. Rather than relying on simple price-feed oracles, they use AI verifiers to reach agreement on subjective terms (e.g., 'Was this flight delayed by weather?', 'Did this audit meet regulatory compliance?').",
  },
  {
    question: "How is AI used in GenLayer?",
    answer: "GenLayer doesn't just run AI locally; it uses AI as a decentralized oracle consensus. When a contract triggers an AI query (like querying a website and evaluating a claim), a set of validator nodes executes the prompt against multiple LLM models (e.g., Claude, GPT-4, Llama). The nodes verify each other's outputs. The contract only commits to the blockchain ledger if nodes achieve a mathematically defined consensus on the subjective result.",
  },
  {
    question: "Is GenLayer decentralized?",
    answer: "Yes, fully. The network is operated by independent node operators globally. Staking mechanisms ensure validators have skin in the game. In addition, using multiple distinct AI models from different providers prevents centralized vendor lock-in or single-model biases from corrupting the consensus outputs.",
  },
  {
    question: "How do users interact with the platform?",
    answer: "Developers interact with GenLayer using standard Web3 libraries and our custom Python SDK. Users interact via their existing Web3 wallets (connected via MetaMask, WalletConnect, etc.). The frontend transmits payloads, and the ledger processes transactions, burning gas in the native GLR token, just like Ethereum or Solana but with deep cognitive oracle capacities.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-dark-bg/60 border-t border-white/5">
      {/* Background gradients */}
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full radial-glow-cyan pointer-events-none opacity-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Questions & Answers</h2>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
              Got questions about GenLayer Intelligent Contracts or AI consensus? We have answered the most common inquiries here.
            </p>
          </motion.div>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`glass-panel rounded-2xl border transition-all duration-300 ${
                  isOpen ? "border-primary/30 bg-primary/5 shadow-md shadow-primary/5" : "border-white/5"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? "text-secondary" : "text-gray-500"}`} />
                    <span className="font-display font-semibold text-sm sm:text-base text-white tracking-tight">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors`}>
                    {isOpen ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-white/5 text-xs sm:text-sm text-gray-400 leading-relaxed">
                        <p className="mt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
