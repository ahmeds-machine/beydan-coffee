"use client";

import dynamic from "next/dynamic";

import { CITY_CLUSTERS } from "@/data/cities";

/**
 * Client-only wrapper for the Leaflet map.
 *
 * Leaflet touches `window` at module scope, so the map is never server
 * rendered. Loading it dynamically also keeps Leaflet out of every other
 * page's bundle — it is only fetched when someone opens Contact.
 */
const ContactMapView = dynamic(() => import("./contact-map-view"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div
      className="grid h-full w-full place-items-center bg-bone-deep"
      role="status"
      aria-live="polite"
    >
      <p className="eyebrow text-ink-soft">Loading map…</p>
    </div>
  );
}

export function ContactMap() {
  return (
    <div className="relative h-full w-full">
      <ContactMapView />
      {/* The map is decorative reinforcement; this is the text equivalent for
          anyone who cannot use it, and it stays in the accessibility tree. */}
      <p className="sr-only">
        Beydan Coffee trades from{" "}
        {CITY_CLUSTERS.map(
          (city) => `${city.stores.length} in ${city.name}`,
        ).join(", ")}
        . The full directory with addresses, hours and phone numbers is on the
        Locations page.
      </p>
    </div>
  );
}
