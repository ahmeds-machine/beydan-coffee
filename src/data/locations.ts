/**
 * Store directory — all 11 cafés.
 *
 * Names, addresses, weekly hours and phone numbers are transcribed verbatim
 * from Beydan. Stores 1–4 come from the live site's locations carousel;
 * stores 5–11 were supplied directly.
 *
 * Two states the first four stores did not exercise:
 *  - `phone: null` — the store trades but its line is not live yet
 *    ("Phone line coming soon"). Call and WhatsApp ordering are withheld
 *    rather than pointed at a placeholder number.
 *  - `trading: false` — the store has not opened, so it has no schedule at
 *    all. It shows "Opening soon" instead of a computed live status.
 *
 * REMAINING GAP — see README:
 *  - [NEEDS CONTENT: latitude/longitude per store] Supplying coordinates makes
 *    "Get directions" land on the exact pin instead of a text search. City
 *    centres are used for the contact map; see src/data/cities.ts.
 */

import {
  MIDNIGHT,
  hm,
  past,
  weeklyFromSchedule,
  type ScheduleBlock,
  type WeeklyHours,
} from "@/lib/hours";

/** Somalia observes UTC+3 year-round with no daylight saving. */
export const STORE_TIMEZONE = "Africa/Mogadishu";

export interface StoreLocation {
  slug: string;
  name: string;
  address: string;
  /** Confirmed for every store: 9 Mogadishu, 1 Hargeisa, 1 Garoowe. */
  city: string;
  /** [NEEDS CONTENT] Supplying this upgrades directions from a text query to a pin. */
  coordinates: { lat: number; lng: number } | null;
  /** E.164 exactly as supplied, or null while the line is being connected. */
  phone: string | null;
  /** False for a café that has not opened yet: no schedule, no live status. */
  trading: boolean;
  schedule: readonly ScheduleBlock[];
  hours: WeeklyHours;
}

/** Sat – Wed 7:00 AM – 12:00 AM: shared by every trading store. */
const SAT_TO_WED: ScheduleBlock = {
  label: "Sat – Wed",
  days: ["sat", "sun", "mon", "tue", "wed"],
  open: hm(7),
  close: MIDNIGHT,
};

/** Thu 7:00 AM – 12:30 AM, Fri 1:00 PM – 12:00 AM: the common pattern. */
const THU_HALF_PAST: ScheduleBlock = {
  label: "Thu",
  days: ["thu"],
  open: hm(7),
  close: past(0, 30),
};

const FRI_AFTERNOON: ScheduleBlock = {
  label: "Fri",
  days: ["fri"],
  open: hm(13),
  close: MIDNIGHT,
};

const STANDARD_WEEK: readonly ScheduleBlock[] = [
  SAT_TO_WED,
  THU_HALF_PAST,
  FRI_AFTERNOON,
];

function store(
  input: Omit<StoreLocation, "hours" | "coordinates" | "trading"> &
    Partial<Pick<StoreLocation, "coordinates" | "trading">>,
): StoreLocation {
  return {
    coordinates: null,
    trading: true,
    ...input,
    hours: weeklyFromSchedule(input.schedule),
  };
}

export const LOCATIONS: readonly StoreLocation[] = [
  store({
    slug: "taleh",
    city: "Mogadishu",
    name: "Taleh",
    address: "Beydan Road, Taleh",
    phone: "+252 613 285 555",
    schedule: [
      SAT_TO_WED,
      { label: "Thu", days: ["thu"], open: hm(7), close: past(1) },
      { label: "Fri", days: ["fri"], open: hm(12, 45), close: MIDNIGHT },
    ],
  }),
  store({
    slug: "mosque",
    city: "Mogadishu",
    name: "Mosque",
    address: "Ali Jimale Mosque",
    phone: "+252 611 598 173",
    schedule: [
      SAT_TO_WED,
      THU_HALF_PAST,
      { label: "Fri", days: ["fri"], open: hm(8), close: MIDNIGHT },
    ],
  }),
  store({
    slug: "jubba",
    city: "Mogadishu",
    name: "Jubba",
    address: "1st Floor, Jubba Hypermarket",
    phone: "+252 770 241 739",
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "laba-dhagah",
    city: "Mogadishu",
    name: "Laba Dhagah",
    address: "Jidka Sodonka",
    phone: "+252 770 782 642",
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "banaadir-mall",
    city: "Mogadishu",
    name: "Banaadir Mall",
    address: "Ground Floor, Banaadir Mall",
    phone: "+252 612 761 851",
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "sand-market",
    city: "Mogadishu",
    name: "Sand Market",
    address: "1st Floor, Rugsan Mall",
    phone: "+252 612 226 937",
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "hamar-weyne",
    city: "Mogadishu",
    name: "Hamar Weyne",
    address: "10th Floor, Mogadishu Mall",
    phone: "+252 771 848 220",
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "wadaadiid-mall",
    name: "Wadaadiid Mall",
    address: "Hargeisa, Somaliland",
    city: "Hargeisa",
    phone: null,
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "aleen-square",
    city: "Mogadishu",
    name: "Aleen Square",
    address: "Aleen Square, Banaadir",
    phone: null,
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "tamam-park",
    name: "Tamam Park",
    address: "Garowe, Puntland",
    city: "Garoowe",
    phone: null,
    schedule: STANDARD_WEEK,
  }),
  store({
    slug: "airport",
    city: "Mogadishu",
    name: "Airport",
    address: "Airport Road, Wadajir District",
    phone: null,
    trading: false,
    schedule: [],
  }),
];

export const TOTAL_STORE_COUNT = LOCATIONS.length;

/** Cafés currently trading, i.e. everything except the ones still fitting out. */
export const TRADING_LOCATIONS = LOCATIONS.filter((store) => store.trading);

/** Cafés you can phone right now. */
export const CALLABLE_LOCATIONS = LOCATIONS.filter((store) => store.phone);

/** Cities named on the live site's contact map, in the site's own order. */
export const CITIES = ["Hargeisa", "Garoowe", "Mogadishu"] as const;
