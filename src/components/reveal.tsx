"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-triggered reveal. Fires once, respects prefers-reduced-motion (where
 * it degrades to a plain opacity fade), and never animates layout properties,
 * so it cannot introduce cumulative layout shift.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 22,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
      transition={{ duration: reduced ? 0.2 : 0.75, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/** Staggers its children on scroll. Pair with `RevealItem`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 26 },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.7, ease: EASE },
    },
  };

  return (
    <Component data-reveal="" className={className} variants={variants}>
      {children}
    </Component>
  );
}

type HeadlineTag = "h1" | "h2" | "p";

/**
 * The oversized display headline, revealed a line at a time from behind a
 * mask. This is the page’s most theatrical moment, so it is the only place
 * that uses a masked reveal — everything else fades.
 *
 * The scroll trigger lives on the heading itself, never on the masked lines.
 * A line starts translated fully outside its `overflow-hidden` wrapper, and
 * IntersectionObserver clips against ancestor overflow — so a trigger placed
 * on the line would report "never visible" and the headline would stay hidden
 * forever. The heading is unclipped, so it observes correctly and drives the
 * lines through variants.
 */
export function LineReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  mode = "scroll",
  delay = 0,
  stagger = 0.08,
}: {
  lines: readonly string[];
  as?: HeadlineTag;
  className?: string;
  lineClassName?: string;
  /** `mount` for above-the-fold heroes, `scroll` for everything below. */
  mode?: "mount" | "scroll";
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const Heading = motion[as];

  const lineVariants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.25, ease: EASE } },
      }
    : {
        hidden: { y: "110%" },
        shown: { y: "0%", transition: { duration: 0.95, ease: EASE } },
      };

  const trigger =
    mode === "mount"
      ? { animate: "shown" as const }
      : {
          whileInView: "shown" as const,
          viewport: { once: true, amount: 0.3, margin: "0px 0px -60px 0px" },
        };

  return (
    <Heading
      className={className}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        shown: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            data-reveal=""
            className={cn("block", lineClassName)}
            variants={lineVariants}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Heading>
  );
}
