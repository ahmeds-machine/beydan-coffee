import Image from "next/image";
import { ImageOff } from "lucide-react";

import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Renders real photography when it exists and a deliberate, clearly-labelled
 * placeholder when it does not.
 *
 * No photography shipped with the rebuild brief, so every slot currently draws
 * the placeholder. Drop a file into `public/images/` matching the slot’s name
 * and the real image takes over on the next build.
 */
export function MediaFrame({
  media,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  tone = "warm",
  compact = false,
  style,
  imageStyle,
  children,
}: {
  media: Media;
  className?: string;
  imageClassName?: string;
  /**
   * Applied to the image itself — chiefly `objectPosition`, for photographs
   * whose subject sits away from centre and would otherwise be cropped out.
   */
  imageStyle?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  tone?: "warm" | "espresso" | "bone";
  /** Small slots (thumbnails, avatars) show the icon only — captions do not fit. */
  compact?: boolean;
  style?: React.CSSProperties;
  /** Overlays such as steam, rendered above the image. */
  children?: React.ReactNode;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden",
        media.src ? "bg-timber" : placeholderSurface(tone),
        className,
      )}
    >
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={imageStyle}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <PlaceholderBody media={media} tone={tone} compact={compact} />
      )}
      {children}
    </div>
  );
}

function placeholderSurface(tone: "warm" | "espresso" | "bone") {
  switch (tone) {
    case "espresso":
      return "bg-espresso-raised";
    case "bone":
      return "bg-bone-deep";
    default:
      return "bg-timber";
  }
}

function PlaceholderBody({
  media,
  tone,
  compact,
}: {
  media: Media;
  tone: "warm" | "espresso" | "bone";
  compact: boolean;
}) {
  const onLight = tone === "bone";

  return (
    <div
      className={cn(
        "absolute inset-0 grid place-items-center",
        onLight ? "text-ink-soft" : "text-cream-soft",
      )}
      // Not aria-hidden: the placeholder carries the only description of what
      // belongs here, which is useful to anyone auditing the page.
      role="img"
      aria-label={`Placeholder — ${media.subject}. No image supplied yet.`}
    >
      {/* Warm wash so the slot reads as a designed surface, not a broken image. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          onLight
            ? "bg-[radial-gradient(120%_100%_at_20%_0%,var(--beydan-bone)_0%,var(--beydan-bone-deep)_70%)]"
            : "bg-[radial-gradient(120%_110%_at_25%_0%,var(--beydan-amber-deep)_0%,var(--beydan-timber)_55%,var(--beydan-espresso)_100%)]",
        )}
      />
      <div aria-hidden="true" className="rake absolute inset-0 opacity-[0.045]" />

      <div className="relative flex max-w-[85%] flex-col items-center gap-2.5 px-4 text-center">
        <ImageOff
          className={cn("opacity-60", compact ? "size-4" : "size-5")}
          aria-hidden="true"
        />
        {compact ? null : (
          <p className="text-[0.8125rem] leading-snug font-medium">
            {media.subject}
          </p>
        )}
        {compact ? null : (
          <p className="eyebrow text-[0.5625rem] opacity-70">Image needed</p>
        )}
        {compact ? null : (
        <code
          className={cn(
            "max-w-full truncate rounded-full border px-2.5 py-1 font-mono text-[0.625rem]",
            onLight ? "border-bone-line" : "border-white/15",
          )}
        >
          {media.name}
        </code>
        )}
      </div>
    </div>
  );
}
