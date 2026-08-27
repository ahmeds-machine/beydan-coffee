import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The paired call-to-action: a filled pill sitting beside a circular outline
 * button holding nothing but an arrow. Used everywhere a primary action
 * appears — a primary CTA is never a lone pill.
 *
 * Accessibility note: the pill and the circle point at the same destination,
 * so they are rendered as a single link with two shapes rather than two
 * adjacent links with identical accessible names. One focus stop, one
 * announcement, same composition.
 */
export function Cta({
  href,
  children,
  variant = "solid",
  arrow = "up-right",
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  /** `solid` = crimson fill. `ghost` = outline, for secondary actions. */
  variant?: "solid" | "ghost";
  arrow?: "up-right" | "right";
  className?: string;
  external?: boolean;
}) {
  const Arrow = arrow === "right" ? ArrowRight : ArrowUpRight;
  const solid = variant === "solid";

  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group/cta inline-flex items-center gap-2 rounded-full",
        "focus-visible:outline-2 focus-visible:outline-offset-4",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex min-h-11 items-center rounded-full px-6 py-3 text-sm font-semibold tracking-tight",
          "transition-[background-color,color,transform] duration-200 ease-out",
          "group-active/cta:scale-[0.97]",
          solid
            ? "bg-crimson text-white group-hover/cta:bg-crimson-lift"
            : "border border-current/35 text-foreground group-hover/cta:border-current/70 group-hover/cta:bg-foreground/5",
        )}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border",
          "transition-[background-color,border-color,transform] duration-200 ease-out",
          "group-active/cta:scale-[0.97]",
          solid
            ? "border-current/35 group-hover/cta:border-crimson group-hover/cta:bg-crimson"
            : "border-current/35 group-hover/cta:border-crimson group-hover/cta:bg-crimson",
        )}
      >
        <Arrow
          className={cn(
            "size-4 transition-[transform,color] duration-200 ease-out",
            "group-hover/cta:text-white",
            arrow === "right"
              ? "group-hover/cta:translate-x-0.5"
              : "group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5",
          )}
        />
      </span>
    </Link>
  );
}

/** Two CTAs side by side, wrapping cleanly on narrow screens. */
export function CtaRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-4", className)}>
      {children}
    </div>
  );
}
