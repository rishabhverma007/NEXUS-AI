import type { Transition } from "framer-motion";

/**
 * Shared spring physics & easing — the NEXUS "motion system".
 * Mirrors the next16-claude-starter philosophy: all real motion is
 * spring-based, with one canonical set of curves so every reveal,
 * stagger and parallax feels like part of one system.
 */

/** Signature entrance ease (overshoot-free cubic-bezier). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

/** Spring configs (framer-motion `transition` objects). */
export const springs = {
  /** Gentle, natural entrance — most reveals. */
  gentle: {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  } as Transition,

  /** Snappy micro-interaction (hover, toggle). */
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  } as Transition,

  /** Weighty, dramatic entrance (hero elements). */
  dramatic: {
    type: "spring",
    stiffness: 80,
    damping: 22,
    mass: 1.1,
  } as Transition,

  /** Tween with the signature entrance ease (for staggered text). */
  text: {
    duration: 0.85,
    ease: EASE_OUT,
  } as Transition,

  /** Smooth scroll-scrubbed interpolation. */
  scroll: {
    type: "spring",
    stiffness: 60,
    damping: 20,
  } as Transition,
} as const;

/** Default text reveal stagger (ms between words/lines). */
export const TEXT_STAGGER = 0.045;
export const LINE_STAGGER = 0.09;
