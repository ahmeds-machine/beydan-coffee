import { describe, expect, it } from "vitest";

import { LOCATIONS } from "@/data/locations";
import {
  destinationQuery,
  googleMapsUrl,
  phoneDigits,
  prefersAppleMaps,
  telHref,
  whatsappOrderUrl,
} from "./maps";

const bySlug = (slug: string) => {
  const store = LOCATIONS.find((candidate) => candidate.slug === slug);
  if (!store) throw new Error(`No store "${slug}"`);
  return store;
};

describe("phone handling", () => {
  it("strips a printed number down to dialable digits", () => {
    expect(phoneDigits("+252 613 285 555")).toBe("252613285555");
    expect(telHref("+252 613 285 555")).toBe("tel:+252613285555");
  });

  it("builds a pre-filled WhatsApp order for a café with a live line", () => {
    const url = whatsappOrderUrl(bySlug("taleh"));
    expect(url).toBe(
      "https://wa.me/252613285555?text=Hi%20Beydan%20Taleh!%20I'd%20like%20to%20place%20an%20order.",
    );
  });

  it("returns null rather than a broken link when the line is not connected", () => {
    expect(whatsappOrderUrl(bySlug("wadaadiid-mall"))).toBeNull();
    expect(whatsappOrderUrl(bySlug("aleen-square"))).toBeNull();
    expect(whatsappOrderUrl(bySlug("tamam-park"))).toBeNull();
    expect(whatsappOrderUrl(bySlug("airport"))).toBeNull();
  });
});

describe("destinationQuery", () => {
  it("appends city and country when the address does not imply them", () => {
    expect(destinationQuery(bySlug("taleh"))).toBe(
      "Beydan Coffee Taleh, Beydan Road, Taleh, Mogadishu, Somalia",
    );
  });

  it("does not append Somalia to an address that already names its territory", () => {
    // "Hargeisa, Somaliland, Somalia" geocodes badly; leave it alone.
    const query = destinationQuery(bySlug("wadaadiid-mall"));
    expect(query).toBe("Beydan Coffee Wadaadiid Mall, Hargeisa, Somaliland");
    expect(query.endsWith(", Somalia")).toBe(false);
  });

  it("leaves a Puntland address alone too", () => {
    expect(destinationQuery(bySlug("tamam-park"))).toBe(
      "Beydan Coffee Tamam Park, Garowe, Puntland",
    );
  });

  it("never repeats a city the address already names", () => {
    for (const store of LOCATIONS) {
      const query = destinationQuery(store);
      const seen = new Set<string>();
      for (const part of query.split(", ")) {
        expect(seen.has(part), `"${part}" repeated in "${query}"`).toBe(false);
        seen.add(part);
      }
    }
  });

  it("prefers coordinates when a store has them", () => {
    const withPin = { ...bySlug("taleh"), coordinates: { lat: 2.0469, lng: 45.3182 } };
    expect(destinationQuery(withPin)).toBe("2.0469,45.3182");
  });

  it("produces a usable directions URL for every café", () => {
    for (const store of LOCATIONS) {
      const url = googleMapsUrl(store);
      expect(url.startsWith("https://www.google.com/maps/dir/?api=1&destination=")).toBe(true);
      expect(url).not.toContain(" ");
    }
  });
});

describe("prefersAppleMaps", () => {
  it("detects iPhone and iPad", () => {
    expect(prefersAppleMaps("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)")).toBe(true);
    expect(prefersAppleMaps("Mozilla/5.0 (iPad; CPU OS 17_0)")).toBe(true);
  });

  it("detects iPadOS reporting a desktop Safari user agent", () => {
    const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605";
    expect(prefersAppleMaps(ua, 5)).toBe(true);
    expect(prefersAppleMaps(ua, 0)).toBe(false);
  });

  it("leaves every other platform on the universal link", () => {
    expect(prefersAppleMaps("Mozilla/5.0 (Windows NT 10.0)")).toBe(false);
    expect(prefersAppleMaps("Mozilla/5.0 (Linux; Android 14)")).toBe(false);
  });
});
