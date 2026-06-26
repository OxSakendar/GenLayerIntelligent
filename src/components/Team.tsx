"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const GithubLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="fill-current" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedInLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="fill-current" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// Inline vector avatar generator component for team profiles
function TechAvatar({ seedColor, accentColor }: { seedColor: string; accentColor: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 rounded-full border-2 border-white/10 shadow-inner bg-black/60 relative z-10 transition-transform group-hover:scale-105 duration-300">
      <defs>
        <radialGradient id={`avatarGlow-${seedColor.replace('#', '')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={seedColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`avatarGrad-${seedColor.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={seedColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>
      
      {/* Background radial highlight */}
      <circle cx="50" cy="50" r="45" fill={`url(#avatarGlow-${seedColor.replace('#', '')})`} />
      
      {/* Abstract cryptographic designs (Hexagon, locks, grids) */}
      <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke={`url(#avatarGrad-${seedColor.replace('#', '')})`} strokeWidth="1.5" strokeDasharray="3 2" />
      <polygon points="50,25 72,38 72,62 50,75 28,62 28,38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      
      {/* Tech glyph node in center */}
      <circle cx="50" cy="50" r="10" fill={`url(#avatarGrad-${seedColor.replace('#', '')})`} />
      <circle cx="50" cy="50" r="5" fill="#000" />
      
      {/* Orbiting particles */}
      <circle cx="50" cy="20" r="2.5" fill="#fff" />
      <circle cx="80" cy="50" r="2" fill={accentColor} />
      <circle cx="20" cy="50" r="2" fill={seedColor} />
      <line x1="50" y1="20" x2="50" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <line x1="20" y1="50" x2="40" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <line x1="80" y1="50" x2="60" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
    </svg>
  );
}

const team = [
  {
    name: "Elena Rostova",
    role: "Co-Founder & Lead VM Architect",
    avatarSeed: "#8b5cf6", // Purple
    avatarAccent: "#3b82f6", // Blue
    bio: "Former compiler engineer at Ethereum Foundation. Led development of the GenLayer Virtual Machine (GVM).",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Marcus Vance",
    role: "AI Integration Lead",
    avatarSeed: "#06b6d4", // Cyan
    avatarAccent: "#8b5cf6", // Purple
    bio: "Ex-DeepMind systems researcher. Architected the multi-LLM consensus consensus logic and verifier node network.",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Dr. Aris Thorne",
    role: "Cryptography Research",
    avatarSeed: "#10b981", // Emerald
    avatarAccent: "#06b6d4", // Cyan
    bio: "PHD in decentralized systems. Authored state-relayer proof protocols for fast cross-chain validation.",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sakendar",
    role: "Core Developer",
    avatarSeed: "#f59e0b", // Amber
    avatarAccent: "#e11d48", // Rose
    bio: "Smart contract auditor. Designed Python compiler drivers and dev kits for GenLayer intelligent contracts.",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 relative overflow-hidden bg-dark-bg">
      {/* Background gradients */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Founding Team</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Meet the Architects
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              We are a team of decentralized engineers, AI researchers, and cryptographers building the consensus engine for the future of Web3.
            </p>
          </motion.div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel rounded-3xl p-6 text-center border border-white/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              {/* Avatar Slot */}
              <div className="flex justify-center mb-6 relative">
                {/* Floating ambient glow behind avatar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: `radial-gradient(circle, ${member.avatarSeed} 0%, transparent 70%)` }} />
                <TechAvatar seedColor={member.avatarSeed} accentColor={member.avatarAccent} />
              </div>

              {/* Title & Role */}
              <h4 className="font-display text-lg font-bold text-white tracking-tight">{member.name}</h4>
              <p className="text-xs text-secondary font-medium mt-1 mb-4 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
                {member.role}
              </p>
              
              {/* Bio */}
              <p className="text-gray-400 text-xs leading-relaxed mb-6 px-2 min-h-[60px]">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  aria-label={`${member.name} GitHub`}
                >
                  <GithubLogo className="w-4 h-4" />
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  aria-label={`${member.name} X (Twitter)`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <LinkedInLogo className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
