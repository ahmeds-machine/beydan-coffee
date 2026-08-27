/**
 * City clusters for the contact map.
 *
 * The map shows one pin per city rather than one per store: nine of the eleven
 * cafés are in Mogadishu and individual pins would pile on top of each other
 * at national zoom.
 *
 * ⚠️ COORDINATES ARE APPROXIMATE — [NEEDS CONTENT: real geocoding]
 * These are city-centre approximations, not surveyed positions for any Beydan
 * café. They are good enough to frame the country and cluster the pins, and
 * they are NOT verified store locations. Before launch, geocode each store
 * address properly and populate `coordinates` in src/data/locations.ts; the map
 * can then drop real per-store pins and "Get directions" can target a pin
 * instead of a text search.
 */

import { LOCATIONS, type StoreLocation } from "@/data/locations";

export interface CityCluster {
  name: string;
  /** Approximate city centre. See the warning above. */
  position: [number, number];
  stores: StoreLocation[];
}

/** City-centre approximations, ordered as the live site names them. */
const CITY_CENTRES: Record<string, [number, number]> = {
  Hargeisa: [9.5624, 44.077],
  Garoowe: [8.4054, 48.4845],
  Mogadishu: [2.0469, 45.3182],
};

export const CITY_CLUSTERS: CityCluster[] = Object.entries(CITY_CENTRES).map(
  ([name, position]) => ({
    name,
    position,
    stores: LOCATIONS.filter((store) => store.city === name),
  }),
);

/**
 * Frames the whole country, from Hargeisa in the north-west to Mogadishu in
 * the south-east, matching the old site's default view.
 */
export const SOMALIA_BOUNDS: [[number, number], [number, number]] = [
  [1.2, 42.5],
  [11.5, 51.4],
];

/** Fallback centre/zoom for environments that cannot fit bounds. */
export const SOMALIA_CENTRE: [number, number] = [6.0, 46.5];
export const SOMALIA_ZOOM = 6;
