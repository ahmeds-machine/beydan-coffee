import { Rake } from "@/components/rake";
import { cn } from "@/lib/utils";

/**
 * A full-bleed horizontal band.
 *
 * Alternating espresso and bone bands are the site’s core structural device,
 * so a band is a real component rather than a set of ad-hoc classes. Marking
 * the subtree `data-band="dark"` re-points the semantic colour tokens, which
 * means shadcn primitives nested inside it adopt the espresso palette without
 * any per-instance overrides.
 */
export function Band({
  tone = "light",
  surface,
  children,
  className,
  id,
  as: Tag = "section",
  grain = true,
  ...rest
}: {
  tone?: "dark" | "light";
  /** Optional alternate surface within the tone (e.g. the deeper bone). */
  surface?: "raised" | "deep";
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "footer" | "header";
  grain?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const dark = tone === "dark";

  return (
    <Tag
      id={id}
      data-band={tone}
      className={cn(
        "relative isolate",
        dark
          ? surface === "raised"
            ? "bg-espresso-raised text-cream"
            : "bg-espresso text-cream"
          : surface === "deep"
            ? "bg-bone-deep text-ink"
            : "bg-bone text-ink",
        className,
      )}
      {...rest}
    >
      {grain ? (
        <div
          aria-hidden="true"
          className={cn("grain-layer", dark ? "opacity-[0.2]" : "opacity-[0.14]")}
        />
      ) : null}
      {children}
    </Tag>
  );
}

/** The signature rake: three angled slashes derived from the BEYDAN mark. */
export function RakeRule({ className }: { className?: string }) {
  return <Rake slashes={6} className={cn("h-3 w-auto", className)} />;
}

export function Eyebrow({
  children,
  className,
  withRake = true,
}: {
  children: React.ReactNode;
  className?: string;
  withRake?: boolean;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-crimson", className)}>
      {withRake ? <Rake className="h-3 w-auto" /> : null}
      {children}
    </p>
  );
}
