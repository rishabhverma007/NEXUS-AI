"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

/** Smooth-scroll to a hash target via Lenis (fallback: native). */
function scrollToHash(hash: string, lenis: Lenis | null) {
  if (!hash) return;
  const el = document.getElementById(hash);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Lenis smooth-scroll integration — ported from the next16-claude-starter
 * pattern (ScrollLayout + rAF loop). Buttery inertial scrolling with:
 * - a single requestAnimationFrame loop calling lenis.raf()
 * - reduced-motion respect (native scroll when prefers-reduced-motion)
 * - hash-anchor smooth scrolling after route changes
 * - no-op on touch devices (lenis handles touch natively, but we keep
 *   native touch scrolling for performance)
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  // Smooth-scroll to hash targets — usePathname() strips the #hash, so listen
  // for hashchange + initial location.hash instead (navbar anchor links).
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setTimeout(() => scrollToHash(hash, lenisRef.current), 120);
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return <>{children}</>;
}
