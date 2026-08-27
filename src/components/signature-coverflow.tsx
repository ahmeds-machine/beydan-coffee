"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { MediaFrame } from "@/components/media-frame";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface CoverflowItem {
  key: string;
  /** Upper, larger line of the card title. */
  titleLine1: string;
  /** Optional second line, set smaller beneath the first. */
  titleLine2?: string;
  media: Media;
  ctaText: string;
  ctaUrl: string;
}

/** Card geometry, expressed against the measured track width. */
const MAX_CARD_WIDTH = 330;
const CARD_ASPECT = 500 / 330;
/** How far a flanking card sits from centre, as a share of card width. */
const FLANK_SHIFT = 0.86;

/**
 * A three-deep coverflow: one card face-on, one angled away on each side.
 *
 * The reference this is adapted from keys its positions off an unsigned
 * `(idx - current + total) % total`, with separate branches for `offset === 2`
 * and `offset === total - 2`. That only works from five items up. At four
 * those two branches describe the *same* offset, so the far-left position can
 * never be reached and the fan comes out lopsided. Positions here are keyed off
 * a signed distance instead, which stays symmetrical at any count; anything
 * further than one step away parks behind the centre card, out of sight.
 */
export function SignatureCoverflow({
  items,
  sectionLabel,
  autoplayDelay = 5000,
  className,
}: {
  items: readonly CoverflowItem[];
  sectionLabel?: string;
  autoplayDelay?: number;
  className?: string;
}) {
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cardWidth, setCardWidth] = useState(MAX_CARD_WIDTH);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );

  // Cards are sized from the track rather than a fixed pixel width, so the
  // fan's spacing stays proportional on narrow screens instead of overlapping.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setCardWidth(Math.min(MAX_CARD_WIDTH, track.clientWidth * 0.62));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // Autoplay stops for a pointer resting on the carousel, and never starts at
  // all for a visitor who asked for less motion.
  useEffect(() => {
    if (reduced || paused || total <= 1) return;
    const timer = setInterval(next, autoplayDelay);
    return () => clearInterval(timer);
  }, [reduced, paused, total, next, autoplayDelay]);

  if (total === 0) return null;

  const current = items[index];
  const shift = cardWidth * FLANK_SHIFT;
  const cardHeight = cardWidth * CARD_ASPECT;

  /** Signed steps from the active card, wrapped to the shorter way round. */
  const distanceFrom = (i: number) => {
    let d = i - index;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const travel = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(travel) > 45) (travel < 0 ? next : prev)();
      }}
    >
      {sectionLabel ? (
        <div className="mb-8 flex items-center justify-center gap-3 text-cream-soft">
          <span className="h-px w-9 bg-gradient-to-r from-transparent to-current" />
          <p className="eyebrow">{sectionLabel}</p>
          <span className="h-px w-9 bg-gradient-to-r from-current to-transparent" />
        </div>
      ) : null}

      {/*
        Arrow keys are bound here rather than on `window`: a global listener
        would steal the arrow keys from the rest of the page, including normal
        scrolling. Focus the carousel and they work; leave it and they don't.
      */}
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Signature offerings"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            prev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
          }
        }}
        className="relative flex w-full items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-4 focus-visible:ring-offset-espresso"
        style={{ height: cardHeight, perspective: 1400 }}
      >
        {items.map((item, i) => {
          const d = distanceFrom(i);
          const isCentre = d === 0;
          const isFlank = Math.abs(d) === 1;

          // Reduced motion collapses the fan to a plain crossfade: no rotation,
          // no scaling, no sliding — only the active card is ever shown.
          const transform = reduced
            ? "none"
            : isCentre
              ? "translateX(0px) scale(1) rotateY(0deg)"
              : isFlank
                ? `translateX(${d * shift}px) scale(0.84) rotateY(${d * -24}deg)`
                : "translateX(0px) scale(0.6) rotateY(0deg)";

          const opacity = isCentre ? 1 : reduced ? 0 : isFlank ? 0.65 : 0;

          return (
            <div
              key={item.key}
              aria-hidden={!isCentre}
              inert={!isCentre}
              onClick={() => !isCentre && setIndex(i)}
              style={{
                width: cardWidth,
                height: cardHeight,
                transform,
                opacity,
                zIndex: isCentre ? 30 : isFlank ? 20 : 0,
                filter: isCentre ? "brightness(1)" : "brightness(0.7)",
                transition: reduced
                  ? "opacity 200ms ease"
                  : "transform 800ms cubic-bezier(0.25,1,0.5,1), opacity 800ms ease, filter 800ms ease",
              }}
              className={cn(
                "absolute overflow-hidden rounded-2xl",
                isCentre ? "cursor-default" : "cursor-pointer",
              )}
            >
              <MediaFrame
                media={item.media}
                tone="espresso"
                sizes="330px"
                className="absolute inset-0"
              />

              {/* Keeps the title legible over whatever the photograph turns
                  out to be, without dimming the top of the card. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/10 to-black/95"
              />

              <div
                className="relative z-20 flex h-full flex-col justify-end p-5 text-center transition-opacity duration-500"
                style={{ opacity: isCentre ? 1 : 0 }}
              >
                <h3 className="display-4 text-cream drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                  {item.titleLine1}
                </h3>
                {item.titleLine2 ? (
                  <span className="display-4 text-[0.8em] text-cream-soft drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                    {item.titleLine2}
                  </span>
                ) : null}

                <span
                  aria-hidden="true"
                  className="mx-auto my-3 block h-0.5 w-9 rounded-full bg-crimson"
                />

                <a
                  href={item.ctaUrl}
                  tabIndex={isCentre ? 0 : -1}
                  className={cn(
                    "eyebrow mx-auto inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 text-white",
                    "transition-transform duration-200 motion-safe:hover:scale-105",
                    "outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                  )}
                >
                  {item.ctaText}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          );
        })}

        <Arrow side="left" onClick={prev} />
        <Arrow side="right" onClick={next} />
      </div>

      {/* Names the card that is showing, for anyone not seeing the fan move. */}
      <p className="sr-only" aria-live="polite">
        {`${current.titleLine1}${current.titleLine2 ? ` ${current.titleLine2}` : ""}. Item ${index + 1} of ${total}.`}
      </p>

      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${item.titleLine1}${item.titleLine2 ? ` ${item.titleLine2}` : ""}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              "outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-espresso",
              i === index ? "w-7 bg-crimson" : "w-2 bg-cream/30 hover:bg-cream/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Arrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = side === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Previous offering" : "Next offering"}
      className={cn(
        "absolute top-1/2 z-40 grid size-11 -translate-y-1/2 place-items-center rounded-full",
        "border border-cream/20 bg-espresso/70 text-cream backdrop-blur-sm",
        "transition-colors hover:border-crimson hover:bg-crimson hover:text-white",
        "outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-espresso",
        isLeft ? "left-0 lg:left-6" : "right-0 lg:right-6",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
