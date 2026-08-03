"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface FadingVideoProps {
  src: string;
  className?: string;
  /** Duration of the rAF crossfade between loops in ms. */
  fadeDuration?: number;
}

/**
 * Cinematic looping background video with a custom requestAnimationFrame
 * crossfade on loop. Two stacked <video> elements share the same src; when the
 * active one fires `ended`, a rAF-driven opacity tween hands off to the second
 * element (replaying from 0) so the loop never has a hard cut. No CSS
 * transitions are used.
 */
export function FadingVideo({ src, className = "", fadeDuration = 1200 }: FadingVideoProps) {
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"a" | "b">("a");
  const rafRef = useRef<number | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const videos = { a: videoA, b: videoB };

  const crossfade = useCallback(() => {
    const from = videos[activeRef.current].current;
    const to = videos[activeRef.current === "a" ? "b" : "a"].current;
    if (!from || !to) return;

    // Restart the incoming video from the beginning and play it.
    to.currentTime = 0;
    to.play().catch(() => {});

    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / fadeDuration, 1);
      // Ease in/out for a smooth cinematic blend.
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      from.style.opacity = String(1 - eased);
      to.style.opacity = String(eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        from.pause();
        activeRef.current = activeRef.current === "a" ? "b" : "a";
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [fadeDuration]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleError = () => {
    // If the remote video can't load, degrade gracefully to the starfield.
    setState("error");
  };

  return (
    <div className={`overflow-hidden bg-black ${className}`} aria-hidden="true">
      {/* Starfield fallback while the video loads / if it fails */}
      <div
        className={`cinematic-starfield absolute inset-0 animate-drift transition-opacity duration-1000 ${
          state === "ready" ? "opacity-40" : "opacity-80"
        }`}
      />

      <video
        ref={videoA}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => {
          setState("ready");
          videoA.current?.play().catch(() => {});
        }}
        onEnded={crossfade}
        onError={handleError}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 1 }}
      />
      <video
        ref={videoB}
        src={src}
        muted
        playsInline
        // Same src as A: once A has streamed, B reuses the browser cache.
        // preload="metadata" avoids fetching the large file twice up front.
        preload="metadata"
        onEnded={crossfade}
        onError={handleError}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Deep-space vignette to keep the pure-black aesthetic */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
