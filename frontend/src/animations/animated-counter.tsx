"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/** Count-up number that animates when scrolled into view. */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.8,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // Capture whether the counter is already in view on first paint
  const [seeded] = useState(() => inView);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration, bounce: 0 });

  useEffect(() => {
    if (inView && !seeded) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue, seeded]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix, decimals]);

  // If already in view on first paint, show final value immediately (no 0-flash)
  const initialText = seeded
    ? `${prefix}${value.toFixed(decimals)}${suffix}`
    : `${prefix}0${suffix}`;

  return <span ref={ref} className={className}>{initialText}</span>;
}
