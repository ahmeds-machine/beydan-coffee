import { describe, expect, it } from "vitest";

import { CITY_CLUSTERS, SOMALIA_BOUNDS } from "./cities";
import { LOCATIONS } from "./locations";

describe("city clusters", () => {
  it("covers every café exactly once", () => {
    const clustered = CITY_CLUSTERS.flatMap((city) => city.stores);
    expect(clustered).toHaveLength(LOCATIONS.length);
    expect(new Set(clustered.map((s) => s.slug)).size).toBe(LOCATIONS.length);
  });

  it("splits nine Mogadishu, one Hargeisa, one Garoowe", () => {
    const counts = Object.fromEntries(
      CITY_CLUSTERS.map((city) => [city.name, city.stores.length]),
    );
    expect(counts).toEqual({ Mogadishu: 9, Hargeisa: 1, Garoowe: 1 });
  });

  it("leaves no café without a city", () => {
    for (const store of LOCATIONS) {
      expect(store.city, `${store.slug} has no city`).toBeTruthy();
      expect(CITY_CLUSTERS.some((c) => c.name === store.city)).toBe(true);
    }
  });

  it("puts every city centre inside the framed bounds", () => {
    const [[south, west], [north, east]] = SOMALIA_BOUNDS;
    for (const city of CITY_CLUSTERS) {
      const [lat, lng] = city.position;
      expect(lat, `${city.name} latitude`).toBeGreaterThan(south);
      expect(lat, `${city.name} latitude`).toBeLessThan(north);
      expect(lng, `${city.name} longitude`).toBeGreaterThan(west);
      expect(lng, `${city.name} longitude`).toBeLessThan(east);
    }
  });

  it("keeps exactly three pins, one per city", () => {
    expect(CITY_CLUSTERS).toHaveLength(3);
  });
});
