"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggle(item.id)}
              className={cn(
                "w-full p-5 text-left flex items-center justify-between text-sm font-medium text-slate-100 transition-colors duration-200",
                isOpen && "text-nexus-400"
              )}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-all duration-300 flex-shrink-0",
                  isOpen && "rotate-180 text-nexus-400"
                )}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4"
                >
                  {item.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
