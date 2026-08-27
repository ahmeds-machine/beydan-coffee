"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MediaFrame } from "@/components/media-frame";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

const THUMB_ACTIVE = 120;
/** Matches the strip's `gap-1`, needed to work out how much room is left. */
const THUMB_GAP = 4;
/** Floor for very narrow rows: below this the strip scrolls instead. */
const THUMB_MIN_INACTIVE = 18;
/**
 * Kept just clear of the right edge. Filling the row to the exact pixel makes
 * the scroll container flip its scrollbar on and off, which resizes the row,
 * which resizes the thumbnails — a loop that never settles.
 */
const THUMB_SAFETY = 1;
/** Used only until the strip has been measured (first paint, SSR). */
const THUMB_INACTIVE_FALLBACK = 35;

/**
 * The resting width of an inactive thumbnail, derived from the row rather than
 * hardcoded, so the strip reaches the right edge at any photo count or column
 * width — the active thumbnail keeps its fixed width and the rest share what
 * is left.
 */
function inactiveThumbWidth(rowWidth: number, count: number) {
  if (count < 2 || !rowWidth) return THUMB_INACTIVE_FALLBACK;
  const remaining =
    rowWidth - THUMB_ACTIVE - THUMB_GAP * (count - 1) - THUMB_SAFETY;
  return Math.max(THUMB_MIN_INACTIVE, remaining / (count - 1));
}

/**
 * A full-width featured image with a thumbnail strip beneath it.
 *
 * Three ways in: click a thumbnail, use the prev/next arrows, or drag the
 * featured image sideways. The arrows sit over the image and surface on hover,
 * but also on keyboard focus — otherwise they would be unreachable for anyone
 * not using a pointer.
 */
/**
 * A photograph plus, optionally, where its subject actually sits.
 *
 * The featured frame is far wider than it is tall, so a near-square source
 * shows only a horizontal band of itself. `focus` is an `object-position`
 * value naming which band to keep — needed for shots whose subject is not
 * centred vertically. Omit it and the crop stays centred.
 */
export interface CarouselPhoto extends Media {
  focus?: string;
}

export function PhotoCarousel({
  photos,
  label,
  className,
}: {
  photos: readonly CarouselPhoto[];
  /** Names the carousel for assistive tech, e.g. "Beydan by the numbers". */
  label: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);

  // The slide offset is a multiple of the viewport width, so that width has to
  // be tracked rather than assumed — otherwise the featured image drifts out
  // of alignment on any resize.
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const measure = () => setWidth(element.offsetWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The strip is measured separately from the featured frame: it is what the
  // thumbnails have to divide up, and the two need not stay the same width.
  useEffect(() => {
    const element = stripRef.current;
    if (!element) return;

    // Border-box width, not clientWidth: the latter shrinks when the scroll
    // container shows a scrollbar, which is exactly what the thumbnails resize
    // in response to.
    const measure = () => setStripWidth(element.getBoundingClientRect().width);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dragging || !width) return;
    const target = -index * width;

    if (reduced) {
      x.set(target);
      return;
    }

    const controls = animate(x, target, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    return () => controls.stop();
  }, [index, dragging, width, x, reduced]);

  const last = photos.length - 1;
  const clamp = (value: number) => Math.max(0, Math.min(last, value));
  const current = photos[index];
  const inactiveWidth = inactiveThumbWidth(stripWidth, photos.length);

  return (
    <div className={cn("flex flex-col gap-3", className)} role="group" aria-label={label}>
      <div
        ref={viewportRef}
        // At `lg` the carousel sits in the right column of the section, so the
        // featured frame is sized to bring the whole component out level with
        // the three stat rows beside it rather than to fill the section width.
        className="group relative h-[240px] overflow-hidden rounded-xl border border-current/10 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.85)] sm:h-[300px] lg:h-[384px]"
      >
        <motion.div
          className="flex h-full"
          style={{ x }}
          drag="x"
          dragElastic={0.2}
          dragMomentum={false}
          dragConstraints={{ left: -last * width, right: 0 }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_event, info) => {
            setDragging(false);
            // A flick wins on velocity; a slow drag has to cross a third of
            // the frame before it counts as a change.
            if (Math.abs(info.velocity.x) > 500) {
              setIndex((i) => clamp(info.velocity.x > 0 ? i - 1 : i + 1));
            } else if (Math.abs(info.offset.x) > width * 0.3) {
              setIndex((i) => clamp(info.offset.x > 0 ? i - 1 : i + 1));
            }
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={photo.name}
              className="h-full w-full shrink-0"
              // Offscreen slides stay mounted so the strip can slide, so they
              // are hidden from assistive tech and the tab order instead of
              // being announced as extra images.
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <MediaFrame
                media={photo}
                tone="warm"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="size-full select-none"
                imageClassName="pointer-events-none"
                imageStyle={photo.focus ? { objectPosition: photo.focus } : undefined}
              />
            </div>
          ))}
        </motion.div>

        <Arrow
          direction="previous"
          disabled={index === 0}
          onClick={() => setIndex((i) => clamp(i - 1))}
        />
        <Arrow
          direction="next"
          disabled={index === last}
          onClick={() => setIndex((i) => clamp(i + 1))}
        />
      </div>

      {/*
        The featured frame changes silently, which is imperceptible without
        sight — this narrates the swap instead.
      */}
      <p className="sr-only" aria-live="polite">
        {`${current.subject}${current.src ? "" : " — photograph not supplied yet"}. Image ${index + 1} of ${photos.length}.`}
      </p>

      <div ref={stripRef} className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex h-20 w-full gap-1 pb-2">
          {photos.map((photo, i) => (
            <motion.button
              key={photo.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={
                photo.src
                  ? `Show ${photo.subject}`
                  : `Show ${photo.subject} — photograph not supplied yet`
              }
              aria-pressed={i === index}
              initial={false}
              // `initial={false}` makes this the mount value too, so there is
              // deliberately no `style` width: setting both leaves React and
              // the animation writing the same property and fighting over it.
              animate={{ width: i === index ? THUMB_ACTIVE : inactiveWidth }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }
              }
              className={cn(
                "relative h-full shrink-0 overflow-hidden rounded-md",
                "outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === index ? "opacity-100" : "opacity-60 hover:opacity-100",
              )}
            >
              <MediaFrame
                media={photo}
                tone="warm"
                compact
                sizes={`${THUMB_ACTIVE}px`}
                className="size-full"
                imageStyle={
                  photo.focus ? { objectPosition: photo.focus } : undefined
                }
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrevious ? "Previous photograph" : "Next photograph"}
      className={cn(
        "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-bone text-ink shadow-lg",
        isPrevious ? "left-4" : "right-4",
        // Revealed by pointer hover, but any focus has to reveal them too or
        // they are invisible to anyone arrowing through with a keyboard. This
        // deliberately keys off `focus`, not `focus-visible`: the ring can wait
        // for a keyboard heuristic, the button itself being visible cannot.
        "opacity-0 transition-[opacity,transform] duration-200 group-hover:opacity-80 focus:opacity-100",
        "hover:opacity-100 motion-safe:hover:scale-110",
        "disabled:pointer-events-none disabled:group-hover:opacity-30",
        "outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
