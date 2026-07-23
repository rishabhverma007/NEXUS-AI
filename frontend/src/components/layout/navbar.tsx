"use client";

import Link from "next/link";
import { BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Architecture", href: "#features" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-nexus-950/60 backdrop-blur-2xl border-b border-nexus-border" />
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-950/40 to-transparent pointer-events-none" />

      <nav className="relative z-10 max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-nexus-brand to-nexus-accent p-0.5 shadow-glow-brand group-hover:shadow-[0_0_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-300">
            <div className="h-full w-full bg-nexus-950 rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="h-4 w-4 text-nexus-accent" />
            </div>
          </div>
          <span className="font-bold text-sm text-nexus-50 tracking-tight">NEXUS AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-nexus-400 hover:text-nexus-200 hover:bg-white/[0.04] transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-nexus-300 hover:text-nexus-100 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/chat"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-nexus-brand to-nexus-accent text-white text-xs font-semibold shadow-glow-brand hover:shadow-[0_0_24px_-4px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Launch OS
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden h-9 w-9 rounded-xl nexus-glass border border-nexus-border flex items-center justify-center text-nexus-400"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-full left-0 right-0 mx-4 mb-4 nexus-glass-elevated rounded-2xl border border-nexus-border p-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-nexus-300 hover:text-nexus-100 hover:bg-white/[0.04] transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-nexus-border my-2" />
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-nexus-300 hover:text-nexus-100 hover:bg-white/[0.04] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/chat"
              onClick={() => setIsMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-nexus-brand to-nexus-accent text-center shadow-glow-brand"
            >
              Launch OS
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
