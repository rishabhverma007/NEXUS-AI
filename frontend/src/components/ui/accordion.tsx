"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className={cn(
              "nexus-glass rounded-2xl overflow-hidden transition-all duration-300",
              isOpen && "border-nexus-brand/30 shadow-glow-brand"
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className={cn(
                "w-full p-5 text-left flex items-center justify-between gap-4 transition-colors duration-200",
                "hover:bg-white/[0.02]",
                isOpen && "pb-3"
              )}
            >
              <span className="text-sm font-semibold text-nexus-50 leading-snug tracking-tight">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                  isOpen ? "bg-nexus-brand/10 text-nexus-brand-light" : "bg-nexus-800/60 text-nexus-400"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <div className="h-px bg-gradient-to-r from-nexus-border via-nexus-border to-transparent mb-4" />
                    <p className="text-sm text-nexus-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
