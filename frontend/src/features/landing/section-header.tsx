"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/animations/text-reveal";
import { EASE_OUT } from "@/animations/springs";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-5",
        align === "center" ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl",
        className
      )}
    >
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="eyebrow inline-flex"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
        {eyebrow}
      </motion.span>

      <TextReveal
        as="h2"
        align={align}
        className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]"
      >
        {title}
      </TextReveal>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE_OUT }}
          className="text-sm sm:text-base text-slate-400 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
