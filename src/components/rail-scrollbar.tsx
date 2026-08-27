"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A slim scroll indicator for a horizontal rail.
 *
 * The rails on this site hide their native scrollbar, which leaves a row that
 * scrolls with nothing saying so. This draws the missing affordance: a track
 * the width of the rail and a thumb covering the visible fraction of it.
 *
 * Position maps the way a native scrollbar does — thumb offset and width are
 * both fractions of `scrollWidth` — so dragging the thumb one track-width
 * scrolls the rail one full content-width, and the two never drift apart.
 *
 * It is `aria-hidden`: the rail is already reachable and scrollable by
 * keyboard, and exposing a second, fake slider for the same content would add
 * noise rather than access.
 */
export function RailScrollbar({
  targetRef,
  className,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [{ width, offset }, setThumb] = useState({ width: 1, offset: 0 });
  const [dragging, setDragging] = useState(false);

  const sync = useCallback(() => {
    const rail = targetRef.current;
    if (!rail || rail.scrollWidth <= 0) return;
    setThumb({
      width: Math.min(1, rail.clientWidth / rail.scrollWidth),
      offset: rail.scrollLeft / rail.scrollWidth,
    });
  }, [targetRef]);

  useEffect(() => {
    const rail = targetRef.current;
    if (!rail) return;

    sync();
    rail.addEventListener("scroll", sync, { passive: true });

    // Catches both the rail resizing and its contents reflowing.
    const observer = new ResizeObserver(sync);
    observer.observe(rail);
    for (const child of Array.from(rail.children)) observer.observe(child);

    return () => {
      rail.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [targetRef, sync]);

  /** Track pixels → rail pixels, the one conversion this whole thing needs. */
  const scale = () => {
    const rail = targetRef.current;
    const track = trackRef.current;
    if (!rail || !track || track.clientWidth === 0) return 0;
    return rail.scrollWidth / track.clientWidth;
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = targetRef.current;
    if (!rail) return;

    event.preventDefault();
    setDragging(true);

    const originX = event.clientX;
    const originScroll = rail.scrollLeft;
    const ratio = scale();

    const onMove = (move: PointerEvent) => {
      rail.scrollLeft = originScroll + (move.clientX - originX) * ratio;
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  /** Clicking the bare track centres the view on that point. */
  const jumpToPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = targetRef.current;
    const track = trackRef.current;
    if (!rail || !track) return;

    const x = event.clientX - track.getBoundingClientRect().left;
    rail.scrollTo({
      left: x * scale() - rail.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  // Nothing overflows: there is nothing to indicate.
  if (width >= 1) return null;

  return (
    <div
      aria-hidden="true"
      ref={trackRef}
      onPointerDown={jumpToPoint}
      className={cn(
        "relative h-1 cursor-pointer rounded-full bg-current/12",
        className,
      )}
    >
      <div
        onPointerDown={(event) => {
          // Keep the track's centre-on-click from also firing.
          event.stopPropagation();
          startDrag(event);
        }}
        style={{
          width: `${width * 100}%`,
          left: `${offset * 100}%`,
        }}
        className={cn(
          "absolute inset-y-0 rounded-full bg-crimson",
          dragging ? "cursor-grabbing" : "cursor-grab",
          // Only the resting state eases; during a drag it must track the
          // pointer exactly or it feels rubbery.
          dragging ? "" : "transition-[left,width] duration-150 ease-out",
        )}
      />
    </div>
  );
}
