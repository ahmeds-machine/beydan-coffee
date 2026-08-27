import { cn } from "@/lib/utils";

/**
 * The rake — the site’s signature mark, three slashes leaning at the same
 * angle as the ones inside the BEYDAN logotype. It is a derived graphic
 * device, never assembled into anything resembling the wordmark itself.
 *
 * Drawn as SVG rather than a repeating gradient so the slashes are always
 * whole: a gradient clipped mid-band reads as a scribble at small sizes.
 */
export function Rake({
  className,
  slashes = 3,
}: {
  className?: string;
  slashes?: number;
}) {
  const width = slashes * 7 + 4;

  return (
    <svg
      viewBox={`0 0 ${width} 14`}
      width={width}
      height={14}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 overflow-visible", className)}
    >
      {Array.from({ length: slashes }, (_, index) => (
        <rect
          key={index}
          x={index * 7}
          y={0}
          width={2.5}
          height={14}
          rx={1.25}
          fill="currentColor"
          transform={`skewX(-20) translate(${5 + index * 0.2} 0)`}
        />
      ))}
    </svg>
  );
}
