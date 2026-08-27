import { describe, expect, it } from "vitest";

import {
  MIDNIGHT,
  formatRange,
  formatTime,
  getStoreStatus,
  hm,
  past,
  storeLocalTime,
  weeklyFromSchedule,
  type ScheduleBlock,
} from "./hours";

const MOGADISHU = "Africa/Mogadishu"; // UTC+3, no DST

/** Taleh's real schedule, as printed on beydancoffee.com. */
const TALEH_SCHEDULE: ScheduleBlock[] = [
  {
    label: "Sat – Wed",
    days: ["sat", "sun", "mon", "tue", "wed"],
    open: hm(7),
    close: MIDNIGHT,
  },
  { label: "Thu", days: ["thu"], open: hm(7), close: past(1) },
  { label: "Fri", days: ["fri"], open: hm(12, 45), close: MIDNIGHT },
];

const TALEH = weeklyFromSchedule(TALEH_SCHEDULE);

const at = (iso: string) => new Date(iso);

describe("weeklyFromSchedule", () => {
  it("expands display rows into all seven weekdays", () => {
    expect(Object.keys(TALEH)).toHaveLength(7);
    expect(TALEH.mon).toEqual({ open: 420, close: 1440 });
    expect(TALEH.thu).toEqual({ open: 420, close: 1500 });
    expect(TALEH.fri).toEqual({ open: 765, close: 1440 });
  });

  it("leaves unlisted days closed", () => {
    const partial = weeklyFromSchedule([
      { label: "Mon", days: ["mon"], open: hm(9), close: hm(17) },
    ]);
    expect(partial.mon).toEqual({ open: 540, close: 1020 });
    expect(partial.tue).toBeNull();
  });
});

describe("formatTime", () => {
  it("renders a 12-hour clock", () => {
    expect(formatTime(hm(7))).toBe("7:00 AM");
    expect(formatTime(hm(12, 45))).toBe("12:45 PM");
    expect(formatTime(hm(13))).toBe("1:00 PM");
  });

  it("renders midnight as 12:00 AM whether it is 0 or 1440", () => {
    expect(formatTime(0)).toBe("12:00 AM");
    expect(formatTime(MIDNIGHT)).toBe("12:00 AM");
  });

  it("wraps times that spill past midnight", () => {
    expect(formatTime(past(1))).toBe("1:00 AM");
    expect(formatTime(past(0, 30))).toBe("12:30 AM");
  });

  it("formats the ranges exactly as the live site prints them", () => {
    expect(formatRange(hm(7), MIDNIGHT)).toBe("7:00 AM – 12:00 AM");
    expect(formatRange(hm(7), past(1))).toBe("7:00 AM – 1:00 AM");
    expect(formatRange(hm(12, 45), MIDNIGHT)).toBe("12:45 PM – 12:00 AM");
  });
});

describe("storeLocalTime", () => {
  it("converts an absolute instant into the store's wall clock", () => {
    // 06:00 UTC is 09:00 in Mogadishu (UTC+3).
    const local = storeLocalTime(at("2026-08-24T06:00:00Z"), MOGADISHU);
    expect(local.weekday).toBe("mon");
    expect(local.minutes).toBe(hm(9));
  });

  it("rolls the weekday over when the store is a day ahead of UTC", () => {
    // 21:30 UTC Monday is already 00:30 Tuesday in Mogadishu.
    const local = storeLocalTime(at("2026-08-24T21:30:00Z"), MOGADISHU);
    expect(local.weekday).toBe("tue");
    expect(local.minutes).toBe(hm(0, 30));
  });

  it("reports midnight as 0 minutes, never 1440", () => {
    // 21:00 UTC == 00:00 Mogadishu.
    const local = storeLocalTime(at("2026-08-24T21:00:00Z"), MOGADISHU);
    expect(local.minutes).toBe(0);
    expect(local.weekday).toBe("tue");
  });

  it("resolves the same instant differently for different store timezones", () => {
    const instant = at("2026-08-24T06:00:00Z");
    expect(storeLocalTime(instant, MOGADISHU).minutes).toBe(hm(9));
    expect(storeLocalTime(instant, "UTC").minutes).toBe(hm(6));
    expect(storeLocalTime(instant, "America/New_York").minutes).toBe(hm(2));
    expect(storeLocalTime(instant, "Asia/Tokyo").minutes).toBe(hm(15));
  });
});

describe("getStoreStatus — Taleh", () => {
  it("is open during a normal weekday session", () => {
    const status = getStoreStatus(TALEH, at("2026-08-24T06:00:00Z"), MOGADISHU); // Mon 09:00
    expect(status.state).toBe("open");
    expect(status.label).toBe("Open now");
    expect(status.detail).toBe("Closes 12:00 AM");
    expect(status.minutesUntilClose).toBe(hm(15)); // 09:00 -> midnight
  });

  it("warns when closing time is within 30 minutes", () => {
    const status = getStoreStatus(TALEH, at("2026-08-24T20:45:00Z"), MOGADISHU); // Mon 23:45
    expect(status.state).toBe("closing-soon");
    expect(status.label).toBe("Closing soon");
    expect(status.detail).toBe("Closes in 15 min");
    expect(status.minutesUntilClose).toBe(15);
  });

  it("is closed before opening and names the opening time", () => {
    const status = getStoreStatus(TALEH, at("2026-08-24T03:30:00Z"), MOGADISHU); // Mon 06:30
    expect(status.state).toBe("closed");
    expect(status.detail).toBe("Opens 7:00 AM");
    expect(status.minutesUntilOpen).toBe(30);
  });

  it("treats a 12:00 AM close as the end of the day, not the start", () => {
    // Tue 00:30. Monday closed at midnight and does not spill, so the store
    // is shut — the classic off-by-a-day bug this model exists to prevent.
    const status = getStoreStatus(TALEH, at("2026-08-24T21:30:00Z"), MOGADISHU);
    expect(status.state).toBe("closed");
    expect(status.detail).toBe("Opens 7:00 AM");
    expect(status.minutesUntilOpen).toBe(hm(6, 30));
  });

  it("stays open after midnight when the previous day's session spills over", () => {
    // Fri 00:20 — still inside Thursday's 7:00 AM – 1:00 AM session.
    const status = getStoreStatus(TALEH, at("2026-08-27T21:20:00Z"), MOGADISHU);
    expect(status.state).toBe("open");
    expect(status.detail).toBe("Closes 1:00 AM");
    expect(status.minutesUntilClose).toBe(40);
  });

  it("warns near the end of a spilled-over session", () => {
    // Fri 00:45 — 15 minutes left of Thursday's session.
    const status = getStoreStatus(TALEH, at("2026-08-27T21:45:00Z"), MOGADISHU);
    expect(status.state).toBe("closing-soon");
    expect(status.minutesUntilClose).toBe(15);
  });

  it("respects the late Friday opening", () => {
    const morning = getStoreStatus(TALEH, at("2026-08-28T07:00:00Z"), MOGADISHU); // Fri 10:00
    expect(morning.state).toBe("closed");
    expect(morning.detail).toBe("Opens 12:45 PM");

    const afternoon = getStoreStatus(TALEH, at("2026-08-28T10:00:00Z"), MOGADISHU); // Fri 13:00
    expect(afternoon.state).toBe("open");
    expect(afternoon.detail).toBe("Closes 12:00 AM");
  });

  it("does not spill Friday's midnight close into Saturday", () => {
    const status = getStoreStatus(TALEH, at("2026-08-28T22:30:00Z"), MOGADISHU); // Sat 01:30
    expect(status.state).toBe("closed");
    expect(status.detail).toBe("Opens 7:00 AM");
  });

  it("looks ahead to a later day when today has no session left", () => {
    // A store that only opens on Thursday, asked on a Friday evening.
    const thursdayOnly = weeklyFromSchedule([
      { label: "Thu", days: ["thu"], open: hm(9), close: hm(17) },
    ]);
    const status = getStoreStatus(
      thursdayOnly,
      at("2026-08-28T15:00:00Z"), // Fri 18:00
      MOGADISHU,
    );
    expect(status.state).toBe("closed");
    expect(status.detail).toBe("Opens Thu 9:00 AM");
    expect(status.minutesUntilOpen).toBe(6 * MIDNIGHT + hm(9) - hm(18));
  });
});

describe("timezone independence", () => {
  const instant = at("2026-08-24T06:00:00Z"); // Mon 09:00 Mogadishu, Mon 02:00 New York

  it("does not depend on the runtime timezone", () => {
    // The runtime's own timezone is never read: the result is a pure function
    // of (instant, store timezone). Running the suite under TZ=UTC,
    // TZ=America/New_York, TZ=Asia/Tokyo and TZ=Pacific/Kiritimati (see the
    // `test:tz` script) must produce identical output.
    expect(getStoreStatus(TALEH, instant, MOGADISHU).state).toBe("open");
  });

  it("gives a different answer for the same instant in a different store timezone", () => {
    // Same schedule, same moment — but 02:00 local in New York, so: closed.
    const status = getStoreStatus(TALEH, instant, "America/New_York");
    expect(status.state).toBe("closed");
    expect(status.detail).toBe("Opens 7:00 AM");
  });

  it("handles a store on a positive date-line offset", () => {
    // Pacific/Kiritimati is UTC+14: 06:00 UTC is already 20:00 the same day.
    const status = getStoreStatus(TALEH, instant, "Pacific/Kiritimati");
    expect(status.state).toBe("open");
    expect(status.minutesUntilClose).toBe(hm(4));
  });

  it("agrees across a full sweep of UTC offsets for a fixed wall clock", () => {
    // For each of these zones, pick the instant that is 09:00 local, and
    // assert the store reads "open" with 15 hours left. This exercises the
    // conversion in both directions across the date line.
    const cases: Array<[string, string]> = [
      ["UTC", "2026-08-24T09:00:00Z"],
      ["Africa/Mogadishu", "2026-08-24T06:00:00Z"], // UTC+3
      ["Asia/Tokyo", "2026-08-24T00:00:00Z"], // UTC+9
      ["America/New_York", "2026-08-24T13:00:00Z"], // UTC-4 (DST)
      ["America/Los_Angeles", "2026-08-24T16:00:00Z"], // UTC-7 (DST)
      ["Pacific/Kiritimati", "2026-08-23T19:00:00Z"], // UTC+14
    ];

    for (const [zone, iso] of cases) {
      const local = storeLocalTime(at(iso), zone);
      expect(local.minutes, `${zone} wall clock`).toBe(hm(9));
      expect(local.weekday, `${zone} weekday`).toBe("mon");

      const status = getStoreStatus(TALEH, at(iso), zone);
      expect(status.state, `${zone} state`).toBe("open");
      expect(status.minutesUntilClose, `${zone} remaining`).toBe(hm(15));
    }
  });
});

describe("a café with no schedule at all", () => {
  // The Airport store has not opened, so it has no hours to compute against.
  // The status function must not invent one; the UI shows "Opening soon"
  // from the store's `trading` flag instead.
  const noHours = weeklyFromSchedule([]);

  it("reports closed with no next opening", () => {
    const status = getStoreStatus(noHours, at("2026-08-24T06:00:00Z"), MOGADISHU);
    expect(status.state).toBe("closed");
    expect(status.minutesUntilOpen).toBeNull();
    expect(status.minutesUntilClose).toBeNull();
    expect(status.detail).toBe("Closed");
  });

  it("never claims to be open", () => {
    for (const iso of [
      "2026-08-24T06:00:00Z",
      "2026-08-24T21:30:00Z",
      "2026-08-28T10:00:00Z",
    ]) {
      expect(getStoreStatus(noHours, at(iso), MOGADISHU).state).toBe("closed");
    }
  });
});

describe("getStoreStatus — the standard week shared by most cafés", () => {
  // Sat–Wed 7:00 AM–12:00 AM, Thu 7:00 AM–12:30 AM, Fri 1:00 PM–12:00 AM.
  const standard = weeklyFromSchedule([
    {
      label: "Sat – Wed",
      days: ["sat", "sun", "mon", "tue", "wed"],
      open: hm(7),
      close: MIDNIGHT,
    },
    { label: "Thu", days: ["thu"], open: hm(7), close: past(0, 30) },
    { label: "Fri", days: ["fri"], open: hm(13), close: MIDNIGHT },
  ]);

  it("stays open past midnight on a Thursday, until 12:30 AM", () => {
    // Fri 00:15 — inside Thursday's session, 15 minutes left.
    const status = getStoreStatus(standard, at("2026-08-27T21:15:00Z"), MOGADISHU);
    expect(status.state).toBe("closing-soon");
    expect(status.minutesUntilClose).toBe(15);
  });

  it("is shut once Thursday's session ends at 12:30 AM", () => {
    // Fri 00:45 — Thursday finished, Friday does not open until 1:00 PM.
    const status = getStoreStatus(standard, at("2026-08-27T21:45:00Z"), MOGADISHU);
    expect(status.state).toBe("closed");
    expect(status.detail).toBe("Opens 1:00 PM");
    expect(status.minutesUntilOpen).toBe(hm(12, 15));
  });

  it("opens at 1:00 PM on Friday, not 12:45 PM", () => {
    const early = getStoreStatus(standard, at("2026-08-28T09:50:00Z"), MOGADISHU); // Fri 12:50
    expect(early.state).toBe("closed");

    const open = getStoreStatus(standard, at("2026-08-28T10:05:00Z"), MOGADISHU); // Fri 13:05
    expect(open.state).toBe("open");
  });
});
