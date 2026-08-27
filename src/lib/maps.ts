/**
 * Deep links for the three direct actions on a store card.
 * All of them are built from data transcribed off the live site — nothing here
 * invents a coordinate, a number or a place name.
 */

import type { StoreLocation } from "@/data/locations";

/** Strip a printed number down to the digits a tel:/wa.me link needs. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function telHref(phone: string): string {
  return `tel:+${phoneDigits(phone)}`;
}

/**
 * The destination string handed to a maps provider. Coordinates win when they
 * are known; otherwise we search for the café by brand + store + street, which
 * is the most specific query the published data supports.
 *
 * Some addresses already name their territory ("Hargeisa, Somaliland"), so the
 * country is only appended when it is not implied — geocoders handle
 * "Hargeisa, Somaliland" far better than "Hargeisa, Somaliland, Somalia".
 */
export function destinationQuery(store: StoreLocation): string {
  if (store.coordinates) {
    return `${store.coordinates.lat},${store.coordinates.lng}`;
  }

  // Skip the city when the address already names it, so the query does not
  // read "Hargeisa, Somaliland, Hargeisa". Somali place names are transliterated
  // inconsistently — the site writes "Garoowe", the store address "Garowe" —
  // so the comparison collapses doubled letters before matching.
  const cityIsRedundant =
    !store.city || placeKey(store.address).includes(placeKey(store.city));

  const query = [
    `Beydan Coffee ${store.name}`,
    store.address,
    cityIsRedundant ? null : store.city,
  ]
    .filter(Boolean)
    .join(", ");

  return /somali(a|land)|puntland/i.test(query) ? query : `${query}, Somalia`;
}

/** Normalise a place name for comparison: lowercase, letters only, no doubles. */
function placeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .replace(/(.)\1+/g, "$1");
}

/** Universal fallback — works on every platform including desktop. */
export function googleMapsUrl(store: StoreLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destinationQuery(store),
  )}`;
}

/** Opens Apple Maps natively on iOS/macOS and gracefully on the web elsewhere. */
export function appleMapsUrl(store: StoreLocation): string {
  return `https://maps.apple.com/?daddr=${encodeURIComponent(
    destinationQuery(store),
  )}&dirflg=d`;
}

/**
 * True for iPhone/iPad/iPod, plus iPadOS 13+ which reports a desktop Safari
 * user agent and has to be identified by its touch support.
 */
export function prefersAppleMaps(
  userAgent: string,
  maxTouchPoints = 0,
): boolean {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

export function directionsUrl(store: StoreLocation, apple: boolean): string {
  return apple ? appleMapsUrl(store) : googleMapsUrl(store);
}

/**
 * Pre-filled WhatsApp order message for a specific café, or null while that
 * café's line is still being connected.
 */
export function whatsappOrderUrl(store: StoreLocation): string | null {
  if (!store.phone) return null;

  const message = `Hi Beydan ${store.name}! I'd like to place an order.`;
  return `https://wa.me/${phoneDigits(store.phone)}?text=${encodeURIComponent(
    message,
  )}`;
}
