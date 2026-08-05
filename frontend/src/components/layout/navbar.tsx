"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#enterprise" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-500 ${
        scrolled ? "bg-[#04030c]/80 backdrop-blur-xl border-b border-white/8 py-3" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-glow-violet">
            <div className="h-full w-full bg-[#0a0918] rounded-[14px] flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <BrainCircuit className="h-5 w-5 text-cyan-300" />
              </motion.div>
            </div>
            <span className="absolute -inset-1 rounded-2xl bg-indigo-500/30 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display font-bold text-[15px] text-white tracking-tight">
            NEXUS AI
            <span className="ml-2 text-[9px] font-bold px-2 py-1 rounded-full bg-gradient-to-r from-indigo-500/25 to-cyan-500/25 text-indigo-200 border border-indigo-400/30 align-middle">
              ENTERPRISE
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 text-[13px] font-medium text-slate-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/chat"
            className="shine group px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 text-white font-semibold text-[13px] flex items-center gap-2 shadow-glow-violet hover:shadow-glow hover:scale-[1.03] transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2.5 rounded-xl glass-panel border border-white/10 text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 glass-panel rounded-2xl border border-white/10 p-4 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/chat"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm"
          >
            Launch Dashboard
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
