import type { Metadata } from "next";

import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";
import { LocationCard } from "@/components/location-card";
import { LocationsRail, RailItem } from "@/components/locations-rail";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { CITIES, LOCATIONS, TOTAL_STORE_COUNT } from "@/data/locations";
import { LOCATIONS_INTRO } from "@/data/site";

export const metadata: Metadata = {
  title: "Locations",
  description: LOCATIONS_INTRO,
};

export default function LocationsPage() {
  return (
    <>
      <Band tone="dark" className="pt-36 pb-24 lg:pt-48 lg:pb-28">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">Locations</Eyebrow>
              </Reveal>
              <LineReveal
                lines={[`${TOTAL_STORE_COUNT} cafés.`, "Three cities."]}
                as="h1"
                mode="mount"
                delay={0.1}
                className="display-1 mt-7 text-cream"
              />
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">
                {LOCATIONS_INTRO}
              </p>
              <CtaRow className="mt-8">
                <Cta href="/contact" arrow="right">
                  Plan a gathering with us
                </Cta>
              </CtaRow>
            </Reveal>
          </div>

          {/* City ledger. Which store sits in which city is not published, so
              the cities are listed as a set, not mapped onto stores. */}
          <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-timber-line pt-8">
            {CITIES.map((city) => (
              <li key={city} className="display-4 text-cream-soft">
                {city}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Swipeable rail — the pattern the live site uses. */}
      <Band tone="light" className="band-pad">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-lg">
              <Reveal>
                <Eyebrow>Browse the rail</Eyebrow>
              </Reveal>
              <LineReveal
                lines={["Open right now,", "or opening soon."]}
                className="display-2 mt-6"
              />
            </div>
            <Reveal delay={0.1}>
              <p className="body-base max-w-xs text-ink-soft">
                Every badge is calculated against each café&rsquo;s own local
                time in Somalia, not your device clock, and refreshes every
                minute.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-12" distance={28}>
            <LocationsRail label="Beydan café locations">
              {LOCATIONS.map((store) => (
                <RailItem key={store.slug}>
                  <LocationCard store={store} />
                </RailItem>
              ))}
            </LocationsRail>
          </Reveal>
        </div>
      </Band>

      {/* Full directory — the same cards, laid out to be scanned rather than
          swiped. */}
      <Band tone="light" surface="deep" className="band-pad">
        <div className="shell">
          <Reveal>
            <Eyebrow>Every café</Eyebrow>
          </Reveal>
          <LineReveal
            lines={["Directions, hours,", "and a way to order."]}
            className="display-2 mt-6 max-w-[18ch]"
          />

          <RevealGroup
            as="ul"
            className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            stagger={0.08}
          >
            {LOCATIONS.map((store) => (
              <RevealItem as="li" key={store.slug} className="h-full">
                <LocationCard store={store} anchor />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Band>
    </>
  );
}
