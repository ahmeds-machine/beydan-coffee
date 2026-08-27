"use client";

import { getStoreStatus, type WeeklyHours } from "@/lib/hours";
import { useLiveNow } from "@/lib/use-live-now";
import { cn } from "@/lib/utils";

/**
 * Live "Open now / Closing soon / Closed" badge.
 *
 * The status is computed against the *store’s* local time, never the visitor’s
 * device clock, and refreshes every minute. Until the client clock is
 * available the badge shows a neutral checking state at the same size, so it
 * cannot shift the layout when it resolves.
 */
export function StatusBadge({
  hours,
  timeZone,
  className,
  showDetail = true,
  openingSoon = false,
}: {
  hours: WeeklyHours;
  timeZone: string;
  className?: string;
  showDetail?: boolean;
  /** The café has not opened yet: show a static chip, not a computed status. */
  openingSoon?: boolean;
}) {
  const now = useLiveNow();

  if (openingSoon) {
    return (
      <p className={cn("flex min-h-6 flex-wrap items-center gap-x-2.5 gap-y-1", className)}>
        <span className="inline-flex items-center gap-2 rounded-full bg-crimson px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-white uppercase">
          Opening soon
        </span>

      </p>
    );
  }

  const status = now ? getStoreStatus(hours, now, timeZone) : null;

  const state = status?.state ?? "checking";

  return (
    <p
      className={cn("flex min-h-6 flex-wrap items-center gap-x-2.5 gap-y-1", className)}
      // Announce changes politely rather than interrupting.
      aria-live="polite"
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase",
          state === "open" &&
            "border-[color-mix(in_oklab,var(--beydan-open)_45%,transparent)] text-[var(--beydan-open)] in-data-[band=dark]:text-[var(--beydan-open-on-dark)]",
          state === "closing-soon" &&
            "border-[color-mix(in_oklab,var(--beydan-soon)_45%,transparent)] text-[var(--beydan-soon)] in-data-[band=dark]:text-[var(--beydan-soon-on-dark)]",
          state === "closed" &&
            "border-current/25 text-[var(--beydan-shut)] in-data-[band=dark]:text-[var(--beydan-shut-on-dark)]",
          state === "checking" && "border-current/15 text-current/40",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full bg-current",
            state === "open" && "motion-safe:animate-[beydan-livepulse_2.4s_ease-out_infinite]",
          )}
        />
        {status ? status.label : "Checking hours"}
      </span>

      {showDetail ? (
        <span className="text-[0.8125rem] text-muted-foreground">
          {status ? status.detail : " "}
        </span>
      ) : null}
    </p>
  );
}
