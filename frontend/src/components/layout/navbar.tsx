"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#enterprise" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-500",
        scrolled
          ? "glass-nav border-b border-white/10 shadow-glass"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-nexus-500 via-purple-500 to-cyan-500 p-[2px] shadow-lg shadow-nexus-500/25 group-hover:shadow-nexus-500/40 transition-shadow duration-300">
              <div className="h-full w-full bg-[#05070A] rounded-[10px] flex items-center justify-center">
                <Layers className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100 tracking-tight">
              NEXUS
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-nexus-500/20 text-nexus-400 border border-nexus-500/30">
              ENTERPRISE
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-nexus-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </Link>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link href="/chat">
            <Button
              variant="gradient"
              size="sm"
              className="hidden sm:flex gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass-card border-t border-white/10 mt-0"
        >
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/chat" onClick={() => setMobileOpen(false)}>
              <Button variant="gradient" size="md" className="w-full mt-2">
                <Sparkles className="h-4 w-4" />
                <span>Launch Dashboard</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
