"use client";

import { useSyncExternalStore } from "react";

/**
 * One shared clock for every live element on the page.
 *
 * Each subscriber reads the same `Date`, ticking once a minute, from a single
 * interval — mounting twenty store cards does not create twenty timers. The
 * timer is torn down as soon as the last subscriber unmounts.
 *
 * The server snapshot is `null` so the markup rendered on the server and the
 * first client paint agree; components show a neutral "checking" state until
 * the real clock arrives on hydration.
 */

const subscribers = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let current: Date | null = null;

function tick() {
  current = new Date();
  for (const notify of subscribers) notify();
}

function subscribe(onStoreChange: () => void) {
  // Seed the clock the first time anything subscribes.
  if (!current) current = new Date();

  subscribers.add(onStoreChange);
  if (!timer) timer = setInterval(tick, 60_000);

  return () => {
    subscribers.delete(onStoreChange);
    if (subscribers.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Stable between ticks, so React never re-renders in a loop. */
function getSnapshot(): Date | null {
  return current;
}

function getServerSnapshot(): Date | null {
  return null;
}

export function useLiveNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
