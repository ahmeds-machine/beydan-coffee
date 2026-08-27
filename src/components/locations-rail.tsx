"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Horizontal store rail.
 *
 * Scroll-snap and native touch scrolling do the work — no carousel library is
 * bundled for this. The arrow buttons are a convenience for pointer users;
 * keyboard users can tab straight into the cards, and the rail itself is a
 * focusable, arrow-key-scrollable region.
 */
export function LocationsRail({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    sync();
    rail.addEventListener("scroll", sync, { passive: true });

    const observer = new ResizeObserver(sync);
    observer.observe(rail);

    return () => {
      rail.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-rail-item]");
    const step = card ? card.offsetWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({
      left: step * direction,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={railRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="rail rail-hide-bar -mx-[clamp(1.25rem,4.5vw,4.5rem)] gap-5 px-[clamp(1.25rem,4.5vw,4.5rem)] pb-2"
      >
        {children}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <RailButton
          direction="prev"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
        />
        <RailButton
          direction="next"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
        />
      </div>
    </div>
  );
}

function RailButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-12 place-items-center rounded-full border transition-[background-color,border-color,color,opacity]",
        disabled
          ? "cursor-not-allowed border-current/15 text-current/25"
          : "border-current/25 hover:border-crimson hover:bg-crimson hover:text-white",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="sr-only">
        {direction === "prev" ? "Previous stores" : "Next stores"}
      </span>
    </button>
  );
}

/** Wrapper that gives each rail child its snap point and width. */
export function RailItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-rail-item
      className="w-[min(84vw,21rem)] shrink-0 snap-start md:w-[22rem]"
    >
      {children}
    </div>
  );
}
