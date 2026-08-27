"use client";

import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { CITY_CLUSTERS, SOMALIA_BOUNDS, type CityCluster } from "@/data/cities";

import "leaflet/dist/leaflet.css";
import "./contact-map.css";

/**
 * The contact map: OpenStreetMap tiles with one pin per city.
 *
 * Loaded only on the client (Leaflet needs `window`) via the wrapper in
 * contact-map.tsx.
 *
 * MARKER ICON — SUPPLIED ASSET, STILL NOT THE CLIENT'S SOURCE FILE.
 * `public/markers/beydan-b-mark.svg` is the Beydan map submark: a "B"
 * silhouette carrying the diagonal red/black/gold stripe. It is a *separate
 * brand asset* from the horizontal BEYDAN wordmark used elsewhere on the site.
 *
 * The file shipped here is a practical recreation made from a screenshot, not
 * the client's original artwork — good enough to ship, and to be replaced the
 * moment the real file arrives. Nothing about it is redrawn in code: it is
 * referenced as a file so it stays sharp at any device pixel ratio, and its
 * colours are its own rather than the site's tokens.
 */

/** Native aspect of the mark is 120 × 146 (0.8219). */
const PIN_HEIGHT = 40;
const PIN_WIDTH = Math.round(PIN_HEIGHT * (120 / 146)); // 33

function pinIcon(count: number): L.DivIcon {
  // A count only earns its place where a pin stands for more than one café.
  const badge =
    count > 1
      ? `<span class="beydan-pin__count" aria-hidden="true">${count}</span>`
      : "";

  return L.divIcon({
    className: "beydan-pin",
    // Referenced as a file, never rasterised, so it stays crisp on retina.
    // alt is empty: the accessible name lives on the marker element itself.
    html: `<span class="beydan-pin__mark">
        <img
          src="/markers/beydan-b-mark.svg"
          width="${PIN_WIDTH}"
          height="${PIN_HEIGHT}"
          alt=""
          draggable="false"
        />${badge}
      </span>`,
    iconSize: [PIN_WIDTH, PIN_HEIGHT],
    // The letterform sits flush with the bottom of its viewBox, so the base of
    // the "B" — not its centre — lands on the coordinate.
    iconAnchor: [PIN_WIDTH / 2, PIN_HEIGHT],
    popupAnchor: [0, -PIN_HEIGHT],
    tooltipAnchor: [0, -PIN_HEIGHT / 2],
  });
}

function cityLabel(city: CityCluster): string {
  const count = city.stores.length;
  return `${city.name} — ${count} Beydan ${count === 1 ? "café" : "cafés"}`;
}

const MAP_LABEL =
  "Map of Somalia showing Beydan Coffee cafés in Hargeisa, Garoowe and Mogadishu";

export default function ContactMapView() {
  return (
    <MapContainer
      bounds={SOMALIA_BOUNDS}
      // Wheel zoom would hijack the page scroll; the +/- controls remain.
      scrollWheelZoom={false}
      className="beydan-map h-full w-full"
      // Leaflet makes the container focusable but gives it no accessible name,
      // and MapContainer does not forward aria-* props — so label the real
      // element once the map instance exists.
      ref={(map) => {
        map?.getContainer().setAttribute("aria-label", MAP_LABEL);
      }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      {CITY_CLUSTERS.map((city) => {
        const label = cityLabel(city);
        return (
          <Marker
            key={city.name}
            position={city.position}
            icon={pinIcon(city.stores.length)}
            title={label}
            keyboard
            eventHandlers={{
              // Leaflet gives a divIcon marker tabindex and role="button" but
              // no accessible name — `alt` only applies to image icons, and
              // `title` alone is not reliably announced. The element exists by
              // the time `add` fires.
              add: (event) => {
                event.target.getElement()?.setAttribute("aria-label", label);
              },
            }}
          >
            <Popup>
              <div className="beydan-popup">
                <p className="beydan-popup__eyebrow">{city.name}</p>
                <p className="beydan-popup__count">
                  {city.stores.length}{" "}
                  {city.stores.length === 1 ? "café" : "cafés"}
                </p>
                <ul className="beydan-popup__list">
                  {city.stores.map((store) => (
                    <li key={store.slug}>
                      <Link href={`/locations#${store.slug}`}>
                        {store.name}
                        {store.trading ? null : (
                          <span className="beydan-popup__soon">
                            {" "}
                            · opening soon
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
