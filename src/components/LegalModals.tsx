"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText, Cookie, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ModalType = "privacy" | "terms" | "cookies" | null;

interface Props {
  open: ModalType;
  onClose: () => void;
}

// ─── Cookie toggle row ────────────────────────────────────────────────────────
function CookieToggle({
  title,
  description,
  enabled,
  locked,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className={`flex-shrink-0 mt-0.5 transition-colors ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={`${enabled ? "Disable" : "Enable"} ${title}`}
      >
        {enabled ? (
          <ToggleRight className="w-8 h-8 text-primary" />
        ) : (
          <ToggleLeft className="w-8 h-8 text-gray-600" />
        )}
      </button>
    </div>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-xs text-gray-400 leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────────
function Modal({
  icon,
  label,
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  subtitle: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary/10 via-violet-500/5 to-secondary/10 border-b border-white/5 px-6 py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
            <h2 className="font-display text-lg font-bold text-white">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-white/5 px-6 py-4">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────
function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      icon={<Shield className="w-5 h-5 text-primary" />}
      label="Legal Document"
      title="Privacy Policy"
      subtitle="Last updated: June 26, 2026 · GenLayer Project"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] text-gray-600">
            Questions? <a href="mailto:contact@genlayer.io" className="text-primary hover:underline">contact@genlayer.io</a>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs font-semibold text-primary transition-colors"
          >
            I Understand
          </button>
        </div>
      }
    >
      <p className="text-xs text-gray-400 leading-relaxed py-4 border-b border-white/5">
        GenLayer (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy describes what data we collect, why we collect it, and how it is used when you visit our website or interact with GenLayer Intelligent Contracts.
      </p>

      <Section title="1. Information We Collect">
        <p><strong className="text-gray-300">On-chain Data:</strong> GenLayer operates on a public blockchain. Any interaction with an Intelligent Contract — including wallet addresses, transaction hashes, and execution results — is permanently recorded on-chain and publicly visible. We do not control or store this data separately.</p>
        <p><strong className="text-gray-300">Usage Analytics:</strong> We may collect anonymised browsing data such as page views, referrer URLs, device type, and geographic region to improve the quality of our documentation and product experience. No personally identifiable information is associated with these analytics.</p>
        <p><strong className="text-gray-300">Contact Forms:</strong> If you submit an inquiry via our Contact form, we collect your name, email address, and message content solely to respond to your request.</p>
        <p><strong className="text-gray-300">Newsletter:</strong> When you subscribe to our mailing list, we collect your email address to send protocol updates, developer announcements, and grant information. You may unsubscribe at any time.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Respond to your support and contact requests</li>
          <li>Send developer updates and testnet release notes (newsletter subscribers only)</li>
          <li>Improve the website, documentation, and product experience</li>
          <li>Detect and prevent security threats or abusive behaviour</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
        <p className="mt-2">We do not sell, rent, or share your personal data with third parties for commercial purposes.</p>
      </Section>

      <Section title="3. Blockchain Transparency">
        <p>All GenLayer Intelligent Contract interactions are executed on a public, decentralised ledger. By design, this data — including wallet addresses and execution outcomes — is transparent, immutable, and not subject to deletion. We cannot remove or modify on-chain records.</p>
      </Section>

      <Section title="4. Cookies & Tracking">
        <p>We use strictly necessary cookies for session management and optional analytics cookies for usage insights. You can manage your cookie preferences at any time using the Cookie Settings option in our footer. We do not use tracking pixels or fingerprinting technologies.</p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>Our platform may integrate with third-party services including:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong className="text-gray-300">MetaMask / WalletConnect</strong> — wallet providers subject to their own privacy policies</li>
          <li><strong className="text-gray-300">Vercel Analytics</strong> — anonymised page-view analytics</li>
          <li><strong className="text-gray-300">Chainlist.org</strong> — network configuration registry</li>
        </ul>
      </Section>

      <Section title="6. Data Retention & Deletion">
        <p>Contact form submissions are retained for 12 months and then deleted. Newsletter subscriptions persist until you unsubscribe. Analytics data is retained in aggregated, anonymised form indefinitely. To request deletion of personal data we hold, email <a href="mailto:contact@genlayer.io" className="text-primary">contact@genlayer.io</a>.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to access, correct, or delete personal data we hold about you. You also have the right to object to processing or request data portability. To exercise any of these rights, contact us at <a href="mailto:contact@genlayer.io" className="text-primary">contact@genlayer.io</a>.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. The &ldquo;Last updated&rdquo; date at the top of this document will reflect any changes. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>
      </Section>
    </Modal>
  );
}

// ─── Terms of Service ─────────────────────────────────────────────────────────
function TermsOfServiceModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      icon={<FileText className="w-5 h-5 text-secondary" />}
      label="Legal Document"
      title="Terms of Service"
      subtitle="Last updated: June 26, 2026 · GenLayer Project"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] text-gray-600">
            By using GenLayer you agree to these terms.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 text-xs font-semibold text-secondary transition-colors"
          >
            I Agree
          </button>
        </div>
      }
    >
      <p className="text-xs text-gray-400 leading-relaxed py-4 border-b border-white/5">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the GenLayer website, testnet, documentation, and associated services. By accessing or using any GenLayer service you agree to be bound by these Terms.
      </p>

      <Section title="1. Acceptance of Terms">
        <p>By accessing this website or using GenLayer&rsquo;s technology, you confirm that you are at least 18 years of age and have the legal capacity to enter into these Terms. If you do not agree with any part of these Terms, you must immediately discontinue use of the platform.</p>
      </Section>

      <Section title="2. Description of Services">
        <p>GenLayer provides a decentralised blockchain protocol enabling the deployment of Intelligent Contracts — smart contracts capable of leveraging large language models (LLMs) for autonomous, AI-assisted decision-making. Services include:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>GenLayer Testnet and Mainnet access</li>
          <li>GenLayer Studio development environment</li>
          <li>SDKs, developer tooling, and documentation</li>
          <li>This marketing and informational website</li>
        </ul>
      </Section>

      <Section title="3. Testnet Use">
        <p>The GenLayer Testnet (&ldquo;Studio&rdquo;) is provided for development and evaluation purposes only. Testnet tokens (GEN on Studio) have no monetary value. We reserve the right to reset, modify, or discontinue the testnet environment at any time without notice. Do not use the testnet for production applications or real-value transactions.</p>
      </Section>

      <Section title="4. Intelligent Contracts & AI Outputs">
        <p>GenLayer Intelligent Contracts leverage multiple LLM providers for consensus-based decision-making. You acknowledge that:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>AI outputs are probabilistic and may contain errors</li>
          <li>GenLayer does not guarantee the accuracy, completeness, or fitness for purpose of any AI-generated contract decision</li>
          <li>You are solely responsible for testing and auditing any Intelligent Contract before deploying it on mainnet</li>
          <li>GenLayer is not liable for financial loss resulting from contract execution outcomes</li>
        </ul>
      </Section>

      <Section title="5. Prohibited Uses">
        <p>You may not use GenLayer services to:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Conduct fraudulent, deceptive, or illegal activities</li>
          <li>Deploy contracts designed to harm, exploit, or defraud other users</li>
          <li>Circumvent consensus mechanisms or validator nodes maliciously</li>
          <li>Scrape, reverse-engineer, or attack GenLayer infrastructure</li>
          <li>Violate any applicable local, national, or international laws</li>
        </ul>
      </Section>

      <Section title="6. Intellectual Property">
        <p>The GenLayer protocol, documentation, branding, and website content are the intellectual property of GenLayer and its contributors, licenced under the MIT Licence unless otherwise stated. User-deployed Intelligent Contracts remain the intellectual property of their respective authors.</p>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <p>GenLayer services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranty of any kind, express or implied. We do not warrant that the services will be uninterrupted, error-free, or free of security vulnerabilities. Use of the protocol is at your own risk.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the maximum extent permitted by applicable law, GenLayer and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of funds, data, or profits — arising from your use of the platform, even if we have been advised of the possibility of such damages.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which GenLayer is registered, without regard to its conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.</p>
      </Section>

      <Section title="10. Modifications">
        <p>We reserve the right to modify these Terms at any time. Continued use of GenLayer services after changes are posted constitutes acceptance of the revised Terms. We will endeavour to notify users of material changes via our newsletter or website announcement.</p>
      </Section>
    </Modal>
  );
}

// ─── Cookie Settings ──────────────────────────────────────────────────────────
function CookieSettingsModal({ onClose }: { onClose: () => void }) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Persist preferences to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gl_cookies", JSON.stringify({ essential: true, analytics, marketing }));
    }
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("gl_cookies", JSON.stringify({ essential: true, analytics: true, marketing: true }));
    }
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Modal
      icon={<Cookie className="w-5 h-5 text-amber-400" />}
      label="Preferences"
      title="Cookie Settings"
      subtitle="Manage how GenLayer uses cookies and local storage on your device."
      onClose={onClose}
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {saved ? (
            <p className="text-xs text-emerald-400 font-semibold">✓ Preferences saved successfully.</p>
          ) : (
            <p className="text-[10px] text-gray-600">
              Essential cookies cannot be disabled as they are required for core functionality.
            </p>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSave}
              disabled={saved}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Save My Choices
            </button>
            <button
              onClick={handleAcceptAll}
              disabled={saved}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              Accept All
            </button>
          </div>
        </div>
      }
    >
      {/* Intro */}
      <p className="text-xs text-gray-400 leading-relaxed py-4 border-b border-white/5">
        We use cookies and browser storage to ensure core functionality, understand how our site is used, and optionally to personalise your experience. Toggle categories below to manage your preferences.
      </p>

      {/* Categories */}
      <div className="py-2">
        <CookieToggle
          title="Essential Cookies"
          description="Required for core site functionality — session management, security tokens, and wallet connection state persistence. Cannot be disabled."
          enabled={true}
          locked={true}
        />
        <CookieToggle
          title="Analytics & Performance"
          description="Anonymised page-view statistics via Vercel Analytics help us understand which documentation and features are most useful. No personally identifiable information is collected."
          enabled={analytics}
          onToggle={() => setAnalytics((v) => !v)}
        />
        <CookieToggle
          title="Marketing & Personalisation"
          description="Optional cookies used to tailor content recommendations and track campaign performance across platforms. Disabling this has no effect on core functionality."
          enabled={marketing}
          onToggle={() => setMarketing((v) => !v)}
        />
      </div>

      {/* Info box */}
      <div className="mt-2 p-4 rounded-2xl bg-white/3 border border-white/5 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-400">Note on blockchain data:</strong> Wallet addresses and transaction data submitted to GenLayer contracts are stored on a public blockchain. This is inherent to how decentralised networks operate and is not governed by cookie preferences.{" "}
        <button
          className="text-primary hover:underline"
          onClick={() => {
            /* open privacy modal — handled by parent */
          }}
        >
          See Privacy Policy
        </button>
        .
      </div>
    </Modal>
  );
}

// ─── Root export — manages which modal is open ─────────────────────────────────
export default function LegalModals({ open, onClose }: Props) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence mode="wait">
      {open === "privacy" && <PrivacyPolicyModal key="privacy" onClose={onClose} />}
      {open === "terms" && <TermsOfServiceModal key="terms" onClose={onClose} />}
      {open === "cookies" && <CookieSettingsModal key="cookies" onClose={onClose} />}
    </AnimatePresence>
  );
}
