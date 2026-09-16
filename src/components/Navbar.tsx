"use client";

import { useState, useEffect } from "react";
import { Menu, X, Cpu, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Architecture", href: "#architecture" },
  { name: "Demo", href: "#demo" },
  { name: "Roadmap", href: "#roadmap" },
  { name: "Team", href: "#team" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-bg/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-lg shadow-primary/20">
              <div className="flex items-center justify-center w-full h-full rounded-[11px] bg-dark-bg transition-colors group-hover:bg-dark-bg/60">
                <Cpu className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Escrow</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="#demo"
              className="relative inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-all group-hover:scale-105 duration-300"></span>
              <span className="relative flex items-center gap-1.5">
                Launch App <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-bg/95 border-b border-white/5 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 px-3">
                <a
                  href="#demo"
                  onClick={() => setIsOpen(false)}
                  className="w-full relative inline-flex items-center justify-center px-5 py-3 rounded-xl text-base font-semibold text-white overflow-hidden group shadow-lg shadow-primary/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></span>
                  <span className="relative flex items-center gap-2">
                    Launch App <ChevronRight className="w-5 h-5" />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
