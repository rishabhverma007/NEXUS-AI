"use client";

import { Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, TEXT_STAGGER } from "./springs";

/**
 * TextReveal — a port of the next16-claude-starter `spring-text-engine`
 * pattern: splits copy into words and drives each word with an independent
 * spring reveal clipped by overflow. Mixed children work — plain text is
 * split word-by-word, while styled spans (`<span className="text-gradient">`)
 * animate as single units preserving their own classes.
 *
 * RULES (mirroring the starter's text engine):
 * - The container is `display: flex; flex-wrap: wrap`, so `text-align` alone
 *   does nothing — always pair `text-*` with `justify-*` via `align`.
 * - With `overflow` clipping, keep leading ≥ 1.1 (never `leading-none`) or
 *   descenders get shaved. Use `leading-display` (1.1) as the floor.
 * - Never `justify-between` — the flex items are words, not lines.
 */

type Align = "left" | "center" | "right";

interface TextRevealProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  align?: Align;
  className?: string;
  once?: boolean;
  delay?: number;
  stagger?: number;
  /** Line-height floor for clipped reveals — keep ≥ 1.1 */
  leading?: string;
}

interface WordSlot {
  key: string;
  text: string;
  className?: string;
}

/** Flatten children into word slots (plain text → words, spans → units). */
function toWordSlots(children: React.ReactNode): WordSlot[] {
  const slots: WordSlot[] = [];
  let counter = 0;

  const pushWords = (text: string, className?: string) => {
    // Preserve leading whitespace by attaching it to the previous slot —
    // e.g. `</span> Scalability` keeps the space between the span and word.
    const leadingMatch = text.match(/^(\s+)/);
    if (leadingMatch && slots.length > 0) {
      slots[slots.length - 1].text += leadingMatch[1];
    }
    const words = text.trim().split(" ");
    words.forEach((word, i) => {
      if (word.length === 0) return;
      slots.push({
        key: `w${counter++}`,
        text: i < words.length - 1 ? `${word}\u00A0` : word,
        className,
      });
    });
  };

  const walk = (node: React.ReactNode) => {
    Children.forEach(node, (child) => {
      if (child == null || typeof child === "boolean") return;
      if (typeof child === "string" || typeof child === "number") {
        const text = String(child);
        // Whitespace-only nodes (e.g. `{" "}` between elements) must not be
        // dropped — they keep adjacent words from merging into one.
        if (text.trim().length === 0) {
          const last = slots[slots.length - 1];
          if (last) last.text += text;
          return;
        }
        pushWords(text);
      } else if (isValidElement(child)) {
        const el = child as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
        const nested = el.props?.children;
        if (typeof nested === "string") {
          pushWords(nested, el.props?.className);
        } else if (typeof nested === "number") {
          pushWords(String(nested), el.props?.className);
        } else if (nested != null) {
          // Nested elements (e.g. <span><strong>x</strong></span>) — recurse
          walk(nested);
        } else {
          pushWords("", el.props?.className);
        }
      }
    });
  };

  walk(children);
  return slots;
}

export function TextReveal({
  children,
  as = "span",
  align = "left",
  className,
  once = true,
  delay = 0,
  stagger = TEXT_STAGGER,
  leading = "leading-display",
}: TextRevealProps) {
  const slots = toWordSlots(children);
  const Tag = motion[as as "h1"];

  const alignClasses: Record<Align, string> = {
    left: "text-left justify-start",
    center: "text-center justify-center",
    right: "text-right justify-end",
  };

  const animProps = once
    ? { initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, margin: "-60px" } }
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <Tag
      className={cn("flex flex-wrap", alignClasses[align], leading, className)}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      {...animProps}
    >
      {slots.map((slot) => (
        <span key={slot.key} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={cn("inline-block", slot.className)}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.8, ease: EASE_OUT, delay },
              },
            }}
          >
            {slot.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
