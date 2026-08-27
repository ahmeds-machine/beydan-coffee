"use client";

import { useSyncExternalStore } from "react";
import { MessageCircle, Navigation, Phone } from "lucide-react";

import type { StoreLocation } from "@/data/locations";
import {
  directionsUrl,
  googleMapsUrl,
  prefersAppleMaps,
  telHref,
  whatsappOrderUrl,
} from "@/lib/maps";
import { cn } from "@/lib/utils";

/**
 * The three direct actions on a store card: directions, call, WhatsApp order.
 *
 * These matter most on a phone, so each control is a full 44px touch target and
 * the row is laid out to stay within one-thumb reach at the bottom of a card.
 *
 * Directions render the universal Google Maps URL during SSR and the first
 * paint, then swap to the Apple Maps scheme on iOS/iPadOS once the user agent
 * is known. That ordering keeps the markup hydration-safe and leaves every
 * non-Apple platform on the universal link.
 *
 * Cafés whose phone line is not connected yet simply do not get Call or Order
 * buttons — the card says why in the slot where the number would be. Directions
 * still work: the address is known either way.
 */
export function StoreActions({
  store,
  className,
}: {
  store: StoreLocation;
  className?: string;
}) {
  const apple = useAppleMaps();

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      <li>
        <ActionLink
          href={apple ? directionsUrl(store, true) : googleMapsUrl(store)}
          icon={<Navigation className="size-4" aria-hidden="true" />}
          label="Directions"
          srLabel={`Get directions to Beydan ${store.name}`}
          external
        />
      </li>
      {store.phone ? (
        <>
          <li>
            <ActionLink
              href={telHref(store.phone)}
              icon={<Phone className="size-4" aria-hidden="true" />}
              label="Call"
              srLabel={`Call Beydan ${store.name} on ${store.phone}`}
            />
          </li>
          <li>
            <ActionLink
              href={whatsappOrderUrl(store) ?? "#"}
              icon={<MessageCircle className="size-4" aria-hidden="true" />}
              label="Order"
              srLabel={`Start a WhatsApp order with Beydan ${store.name}`}
              emphasis
              external
            />
          </li>
        </>
      ) : null}
    </ul>
  );
}

/**
 * The user agent is an external, never-changing system, so it is read through
 * useSyncExternalStore rather than an effect: the server snapshot is `false`
 * (universal Google Maps link) and the client snapshot is the real answer.
 */
const NO_OP_SUBSCRIBE = () => () => {};

function useAppleMaps(): boolean {
  return useSyncExternalStore(
    NO_OP_SUBSCRIBE,
    () => prefersAppleMaps(navigator.userAgent, navigator.maxTouchPoints),
    () => false,
  );
}

function ActionLink({
  href,
  icon,
  label,
  srLabel,
  emphasis = false,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  srLabel: string;
  emphasis?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.8125rem] font-semibold",
        "transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]",
        emphasis
          ? "border-crimson bg-crimson text-white hover:bg-crimson-lift"
          : "border-current/20 text-foreground hover:border-crimson hover:text-crimson",
      )}
    >
      {icon}
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{srLabel}</span>
    </a>
  );
}
