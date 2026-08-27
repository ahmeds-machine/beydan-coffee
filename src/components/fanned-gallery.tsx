import { MediaFrame } from "@/components/media-frame";
import { RevealGroup, RevealItem } from "@/components/reveal";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * A hand-arranged spread rather than a flat grid: each frame sits at a slight
 * alternating angle and lifts back to true on hover. The rotations are small
 * enough that the frames still read as a row, not as clutter.
 */
export function FannedGallery({
  items,
  className,
}: {
  items: Media[];
  className?: string;
}) {
  const angles = [-2.2, 1.6, -1.2, 2.2, -1.8, 1.1];

  return (
    <RevealGroup
      as="ul"
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8",
        // The fan below offsets alternate frames with `translate`, which moves
        // them visually without changing layout — so this list's own box never
        // grew to contain them and the lowered frames spilled past the section
        // into the one beneath. This reserves exactly the space the fan uses:
        // 2rem below for the lowered frames, 0.5rem above for the raised ones,
        // plus a little more to cover the extra height the tilt adds to each
        // frame's bounding box.
        "lg:pt-3 lg:pb-10",
        className,
      )}
      stagger={0.07}
    >
      {items.map((item, index) => (
        <RevealItem
          as="li"
          key={item.name}
          className={cn(
            "group/frame",
            // Nudge alternate frames vertically so the row never reads as a grid.
            index % 2 === 1 ? "lg:translate-y-8" : "lg:-translate-y-2",
          )}
        >
          <MediaFrame
            media={item}
            tone={index % 3 === 1 ? "espresso" : "warm"}
            sizes="(min-width: 1024px) 30vw, 45vw"
            className={cn(
              "aspect-[4/5] rounded-xl shadow-[0_30px_70px_-50px_rgba(0,0,0,0.9)]",
              "transition-transform duration-500 ease-out motion-safe:group-hover/frame:rotate-0 motion-safe:group-hover/frame:scale-[1.02]",
            )}
            imageClassName="transition-transform duration-500 ease-out motion-safe:group-hover/frame:scale-105"
            style={{ transform: `rotate(${angles[index % angles.length]}deg)` }}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
