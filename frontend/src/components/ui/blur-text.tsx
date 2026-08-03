"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  /** Delay before the first word animates (s). */
  delay?: number;
  /** Stagger between words (s). */
  stagger?: number;
}

/**
 * Word-by-word cinematic reveal: each word eases from blur(10px) + opacity 0 +
 * a downward y-shift into crisp focus. Driven entirely by Framer Motion.
 */
export function BlurText({ text, className, delay = 0, stagger = 0.09 }: BlurTextProps) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-flex flex-wrap", className)} aria-label={text}>
      <span aria-hidden="true">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block will-change-[filter,opacity,transform]"
          initial={{ opacity: 0, filter: "blur(10px)", y: 24 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            delay: delay + i * stagger,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
      </span>
    </span>
  );
}
