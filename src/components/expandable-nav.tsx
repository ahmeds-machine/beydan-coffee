"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * The primary site navigation.
 *
 * Adapted from the ExpandableTabs pattern: the spring-eased padding growth and
 * the soft pill that fills in behind the highlighted item are kept; the icons,
 * the click-outside collapse and the local selection state are not. A navbar's
 * items must stay visible and clickable at all times, and "which item is
 * active" is a routing fact, so this reads `usePathname()` and renders real
 * links.
 *
 * Each item is a single anchor rather than an anchor wrapping an animated
 * span, so `aria-current` and `href` sit on the element that is actually the
 * link.
 */

const MotionLink = motion.create(Link);

interface NavItem {
  title: string;
  href: string;
}

interface ExpandableNavProps {
  items: readonly NavItem[];
  className?: string;
}

const itemVariants = {
  animate: (isHighlighted: boolean) => ({
    paddingLeft: isHighlighted ? "1.1rem" : "0.75rem",
    paddingRight: isHighlighted ? "1.1rem" : "0.75rem",
  }),
};

const SPRING = { type: "spring" as const, bounce: 0, duration: 0.5 };

export function ExpandableNav({ items, className }: ExpandableNavProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <nav
      aria-label="Primary"
      onMouseLeave={() => setHovered(null)}
      className={cn("flex items-center gap-1", className)}
      style={
        {
          "--nav-active": "var(--beydan-cream)",
          "--nav-muted": "#b8afa2",
        } as React.CSSProperties
      }
    >
      {items.map((item, index) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        // Hovering any item takes the highlight; with nothing hovered it falls
        // back to the current page.
        const isHighlighted = hovered === index || (hovered === null && isActive);

        return (
          <MotionLink
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            variants={itemVariants}
            initial={false}
            animate="animate"
            custom={isHighlighted}
            transition={reduced ? { duration: 0 } : SPRING}
            onMouseEnter={() => setHovered(index)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            className={cn(
              "relative inline-flex min-h-11 items-center rounded-full",
              "text-[11px] font-medium tracking-[0.14em] uppercase",
              "transition-colors duration-300",
              isHighlighted
                ? "bg-white/[0.06] text-[color:var(--nav-active)]"
                : "text-[color:var(--nav-muted)] hover:text-[color:var(--nav-active)]",
            )}
          >
            {item.title}

            {/*
              The pill is shared by hover and active, so on its own the current
              page loses every visual cue the moment you hover something else.
              This bar is tied to the route only. Its width is fixed so it does
              not have to animate alongside the padding.
            */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-[7px] left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full bg-crimson",
                "transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0",
              )}
            />
          </MotionLink>
        );
      })}
    </nav>
  );
}
