import { Phone, PhoneOff } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { StoreActions } from "@/components/store-actions";
import type { StoreLocation } from "@/data/locations";
import { STORE_TIMEZONE } from "@/data/locations";
import { formatRange } from "@/lib/hours";
import { telHref } from "@/lib/maps";
import { cn } from "@/lib/utils";

export function LocationCard({
  store,
  className,
  anchor = false,
}: {
  store: StoreLocation;
  className?: string;
  /**
   * Sets the deep-link target id. Only one rendering of a given café may set
   * this — the rail and the directory grid both render every card, and two
   * elements sharing an id is invalid and makes the anchor ambiguous. The
   * directory grid owns the anchor.
   */
  anchor?: boolean;
}) {
  return (
    <article
      id={anchor ? store.slug : undefined}
      className={cn(
        // Clear the fixed header when the browser jumps to this card.
        anchor && "scroll-mt-28",
        "flex h-full flex-col rounded-2xl border border-bone-line bg-card p-6",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-1 hover:border-crimson/40 hover:shadow-[0_28px_60px_-42px_rgba(36,30,23,0.75)]",
        className,
      )}
    >
      <header>
        <h3 className="display-4">{store.name}</h3>
        <p className="body-base mt-1 text-muted-foreground">{store.address}</p>
      </header>

      <StatusBadge
        hours={store.hours}
        timeZone={STORE_TIMEZONE}
        openingSoon={!store.trading}
        className="mt-4"
      />

      {store.schedule.length > 0 ? (
        <dl className="mt-6 flex flex-col gap-2 border-t border-bone-line pt-5">
          {store.schedule.map((block) => (
            <div
              key={block.label}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="text-[0.8125rem] font-semibold whitespace-nowrap">
                {block.label}
              </dt>
              <dd className="text-right text-[0.8125rem] tabular-nums text-muted-foreground">
                {formatRange(block.open, block.close)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-6 border-t border-bone-line pt-5 text-[0.8125rem] text-muted-foreground">
          Hours will be published before this café starts trading.
        </p>
      )}

      {store.phone ? (
        <a
          href={telHref(store.phone)}
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-[0.9rem] font-semibold text-crimson transition-colors hover:text-oxblood"
        >
          <Phone className="size-4" aria-hidden="true" />
          {store.phone}
          <span className="sr-only">— call Beydan {store.name}</span>
        </a>
      ) : (
        <p className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-[0.9rem] text-muted-foreground">
          <PhoneOff className="size-4" aria-hidden="true" />
          Phone line coming soon
        </p>
      )}

      <StoreActions store={store} className="mt-auto pt-6" />
    </article>
  );
}
