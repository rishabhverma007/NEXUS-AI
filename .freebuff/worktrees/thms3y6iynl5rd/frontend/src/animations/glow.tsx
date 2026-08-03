"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export function MouseFollowerGlow() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.06), transparent 60%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.04), transparent 50%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.15 }}
      />
    </>
  );
}
