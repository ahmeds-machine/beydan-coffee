"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Soft parallax for hero imagery. The movement is small — a hero that slides
 * further than its own padding reads as a gimmick — and is switched off
 * entirely under prefers-reduced-motion.
 *
 * Only `transform` is animated, so this never triggers layout.
 */
export function Parallax({
  children,
  className,
  distance = 48,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [distance, -distance],
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        data-reveal=""
        style={{ y }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
