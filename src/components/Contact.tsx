"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, CheckCircle2, Loader2, Globe } from "lucide-react";

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

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", type: "developer", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert("Please fill in all fields.");
      return;
    }
    
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", email: "", type: "developer", message: "" });
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-dark-bg">
      {/* Background radial highlight */}
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
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Get in Touch</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Connect with GenLayer
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Have questions, feedback, or want to deploy your first Intelligent Contract? Drop us a message or join our developer community.
            </p>
          </motion.div>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Community Links (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

            <div>
              <h4 className="font-display text-2xl font-bold text-white mb-2">Join the Ecosystem</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                Collaborate with core developers and other researchers. Access sandbox environments and contribute to the protocol.
              </p>

              {/* Direct Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300">
                  <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Office location</p>
                    <p className="text-xs sm:text-sm font-semibold">Decentralized Autonomous Network</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">
                Community channels
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: GithubLogo, name: "GitHub", url: "https://github.com", color: "hover:text-white hover:bg-white/10" },
                  { icon: MessageSquare, name: "Discord", url: "https://discord.com", color: "hover:text-[#5865F2] hover:bg-[#5865F2]/10" },
                  { icon: XLogo, name: "X (Twitter)", url: "https://twitter.com", color: "hover:text-white hover:bg-white/10" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 transition-all ${social.color}`}
                  >
                    <social.icon className="w-5 h-5 mb-2" />
                    <span className="text-[10px] font-semibold">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-white/5 relative">
            
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center h-full py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-white mb-2">Message Transmitted</h4>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                    Your transmission was completed successfully. Our team will read your parameters and reach back shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h4 className="font-display text-xl font-bold text-white">Direct Inquiry Form</h4>

                  {/* Name and Email in grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        disabled={status === "sending"}
                        placeholder="Elena"
                        className="w-full bg-black/40 border border-white/15 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-semibold mb-2 block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        disabled={status === "sending"}
                        placeholder="elena@rostova.io"
                        className="w-full bg-black/40 border border-white/15 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Inquiry Type Select */}
                  <div>
                    <label className="text-xs text-gray-400 font-semibold mb-2 block">I am a...</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "developer", label: "Developer" },
                        { id: "validator", label: "Validator Node" },
                        { id: "other", label: "Partner" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          disabled={status === "sending"}
                          onClick={() => setFormState({ ...formState, type: item.id })}
                          className={`py-3 rounded-xl border font-semibold text-xs transition-all ${
                            formState.type === item.id
                              ? "bg-primary/10 border-primary text-white"
                              : "bg-black/20 border-white/5 hover:border-white/10 text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message body */}
                  <div>
                    <label className="text-xs text-gray-400 font-semibold mb-2 block">Message Details</label>
                    <textarea
                      rows={5}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      disabled={status === "sending"}
                      placeholder="Tell us about the Intelligent Contract ideas you want to deploy on GenLayer..."
                      className="w-full bg-black/40 border border-white/15 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-lg shadow-primary/20"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Transmitting payload...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Transmit Message
                        </>
                      )}
                    </button>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
