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
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all hover:border-white/20"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-slate-100 hover:text-indigo-300 transition-colors"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180 text-indigo-300")}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-3"
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
