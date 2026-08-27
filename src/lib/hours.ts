/**
 * Store opening-hours model and live status computation.
 *
 * Design notes
 * ------------
 * 1. Hours are stored as *store-local wall-clock minutes past midnight*. This
 *    is the only representation that survives daylight-saving changes and
 *    visitors in other timezones.
 * 2. A close time may exceed 1440 (= midnight). "7:00 AM - 1:00 AM" is stored
 *    as { open: 420, close: 1500 }: the interval spills into the next calendar
 *    day. "7:00 AM - 12:00 AM" is { open: 420, close: 1440 } — midnight means
 *    the *end* of the day, never 00:00 of the same morning.
 * 3. "Now" is resolved into the store's timezone via Intl, so the visitor's own
 *    device timezone is irrelevant. Nothing here reads the system timezone.
 */

export const WEEKDAYS = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** Minutes past store-local midnight. */
export const MIDNIGHT = 1440;

/** Build a wall-clock time in minutes past midnight. `hm(7, 0)` -> 420. */
export function hm(hour: number, minute = 0): number {
  return hour * 60 + minute;
}

/** A time after midnight belonging to the previous business day. `past(1, 0)` -> 1500. */
export function past(hour: number, minute = 0): number {
  return MIDNIGHT + hm(hour, minute);
}

export interface DayHours {
  /** Minutes past store-local midnight when the store opens. */
  open: number;
  /** Minutes past store-local midnight when it closes; may exceed 1440. */
  close: number;
}

/** A displayed schedule row, e.g. "Sat – Wed  7:00 AM – 12:00 AM". */
export interface ScheduleBlock {
  label: string;
  days: readonly Weekday[];
  open: number;
  close: number;
}

export type WeeklyHours = Record<Weekday, DayHours | null>;

/** Expand the displayed schedule rows into a per-weekday lookup. */
export function weeklyFromSchedule(blocks: readonly ScheduleBlock[]): WeeklyHours {
  const week = Object.fromEntries(
    WEEKDAYS.map((d) => [d, null]),
  ) as WeeklyHours;

  for (const block of blocks) {
    for (const day of block.days) {
      week[day] = { open: block.open, close: block.close };
    }
  }
  return week;
}

export interface StoreLocalTime {
  /** 0 = Sunday, matching the WEEKDAYS array. */
  weekdayIndex: number;
  weekday: Weekday;
  /** Minutes past store-local midnight. */
  minutes: number;
}

const WEEKDAY_FROM_SHORT: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Resolve an absolute instant into the store's local wall clock.
 * Independent of the runtime's own timezone.
 */
export function storeLocalTime(now: Date, timeZone: string): StoreLocalTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    // h23 avoids the ICU quirk where hour12:false renders midnight as "24".
    hourCycle: "h23",
  }).formatToParts(now);

  let weekdayIndex = 0;
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === "weekday") weekdayIndex = WEEKDAY_FROM_SHORT[part.value] ?? 0;
    else if (part.type === "hour") hour = Number(part.value);
    else if (part.type === "minute") minute = Number(part.value);
  }

  return {
    weekdayIndex,
    weekday: WEEKDAYS[weekdayIndex],
    minutes: hm(hour % 24, minute),
  };
}

export type StoreState = "open" | "closing-soon" | "closed";

export interface StoreStatus {
  state: StoreState;
  /** Short badge text: "Open now" / "Closing soon" / "Closed". */
  label: string;
  /** Supporting line: "Closes 12:00 AM" / "Opens Fri 1:00 PM". */
  detail: string;
  /** Minutes until the store closes, when open. */
  minutesUntilClose: number | null;
  /** Minutes until the store next opens, when closed. */
  minutesUntilOpen: number | null;
}

/** Format store-local minutes as a 12-hour clock. Values past 1440 wrap. */
export function formatTime(minutes: number): string {
  const wrapped = ((minutes % MIDNIGHT) + MIDNIGHT) % MIDNIGHT;
  const hour24 = Math.floor(wrapped / 60);
  const minute = wrapped % 60;
  const suffix = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

const DAY_LABEL: Record<Weekday, string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

export function formatRange(open: number, close: number): string {
  return `${formatTime(open)} – ${formatTime(close)}`;
}

export interface StatusOptions {
  /** How many minutes before closing to switch to "Closing soon". */
  closingSoonWindow?: number;
}

/**
 * Compute a store's live status for a given instant.
 *
 * Pure and deterministic: pass an explicit `now` to test it.
 */
export function getStoreStatus(
  hours: WeeklyHours,
  now: Date,
  timeZone: string,
  options: StatusOptions = {},
): StoreStatus {
  const closingSoonWindow = options.closingSoonWindow ?? 30;
  const local = storeLocalTime(now, timeZone);

  const todayIndex = local.weekdayIndex;
  const yesterdayIndex = (todayIndex + 6) % 7;
  const today = hours[WEEKDAYS[todayIndex]];
  const yesterday = hours[WEEKDAYS[yesterdayIndex]];

  // Case 1: still inside yesterday's session, which spilled past midnight.
  if (yesterday && yesterday.close > MIDNIGHT) {
    const closesAt = yesterday.close - MIDNIGHT;
    if (local.minutes < closesAt) {
      return openStatus(closesAt - local.minutes, closesAt, closingSoonWindow);
    }
  }

  // Case 2: inside today's session.
  if (today && local.minutes >= today.open && local.minutes < today.close) {
    return openStatus(
      today.close - local.minutes,
      today.close,
      closingSoonWindow,
    );
  }

  // Case 3: closed — find the next opening within the coming week.
  let minutesUntilOpen: number | null = null;
  let detail = "Closed";

  for (let offset = 0; offset < 8; offset += 1) {
    const day = hours[WEEKDAYS[(todayIndex + offset) % 7]];
    if (!day) continue;

    const opensAt = offset * MIDNIGHT + day.open;
    if (opensAt <= local.minutes) continue;

    minutesUntilOpen = opensAt - local.minutes;
    detail =
      offset === 0
        ? `Opens ${formatTime(day.open)}`
        : `Opens ${DAY_LABEL[WEEKDAYS[(todayIndex + offset) % 7]]} ${formatTime(day.open)}`;
    break;
  }

  return {
    state: "closed",
    label: "Closed",
    detail,
    minutesUntilClose: null,
    minutesUntilOpen,
  };
}

function openStatus(
  minutesUntilClose: number,
  closesAt: number,
  closingSoonWindow: number,
): StoreStatus {
  const closingSoon = minutesUntilClose <= closingSoonWindow;
  return {
    state: closingSoon ? "closing-soon" : "open",
    label: closingSoon ? "Closing soon" : "Open now",
    detail: closingSoon
      ? `Closes in ${minutesUntilClose} min`
      : `Closes ${formatTime(closesAt)}`,
    minutesUntilClose,
    minutesUntilOpen: null,
  };
}
