import type { Metadata } from "next";

import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";
import { MediaFrame } from "@/components/media-frame";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { CONTACT, FRANCHISE_HERO, FRANCHISE_PILLARS, FRANCHISE_SECTION } from "@/data/site";
import { CITIES, TOTAL_STORE_COUNT } from "@/data/locations";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Franchise",
  description: FRANCHISE_HERO.body,
};

const FRANCHISE_MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "Franchise enquiry — Beydan Coffee",
)}&body=${encodeURIComponent(
  "City / market:\nAbout you:\nSites you have in mind:\nBest number to reach you:",
)}`;

export default function FranchisePage() {
  const heroMedia = resolveMedia(
    "franchise-hero",
    "A full Beydan café in the evening, guests at tables throughout the room",
    "Evening at the café",
  );

  return (
    <>
      <Band tone="dark" className="pt-36 pb-24 lg:pt-48 lg:pb-0">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">{FRANCHISE_HERO.eyebrow}</Eyebrow>
              </Reveal>
              <LineReveal
                lines={FRANCHISE_HERO.headline}
                as="h1"
                mode="mount"
                delay={0.1}
                className="display-1 mt-7 text-cream"
              />
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">
                {FRANCHISE_HERO.body}
              </p>
              <CtaRow className="mt-8">
                <Cta href={FRANCHISE_MAILTO} arrow="right">
                  Enquire about a market
                </Cta>
                <Cta href="#how-it-works" variant="ghost">
                  Explore the process
                </Cta>
              </CtaRow>
            </Reveal>
          </div>
        </div>

        <div className="shell mt-16">
          {/*
            No Parallax here: that wrapper drives a scroll-linked translateY,
            which made this image drift as the page scrolled. The hero is meant
            to sit still like the rest of the site's imagery.
          */}
          <Reveal distance={30}>
            {/*
              The frame is 21/9 against a 16/9 source, so only about 72% of the
              photo's height survives. Centred, the out-of-focus table in the
              foreground swallowed a third of the frame; anchoring higher gives
              the room and its guests — the actual subject — the space.
            */}
            <MediaFrame
              media={heroMedia}
              priority
              sizes="(min-width: 1440px) 1200px, 92vw"
              className="aspect-[16/9] rounded-t-3xl lg:aspect-[21/9]"
              imageStyle={{ objectPosition: "center 22%" }}
            />
          </Reveal>
        </div>
      </Band>

      <Band tone="light" id="how-it-works" className="band-pad">
        <div className="shell">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{FRANCHISE_SECTION.eyebrow}</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["A centrally operated café", "system built for scale."]}
              className="display-2 mt-6"
            />
          </div>

          {/* Four pillars as a ledger of rows rather than another card grid —
              the copy is a list of commitments, so it reads as one. */}
          <RevealGroup as="ol" className="mt-16 flex flex-col" stagger={0.09}>
            {FRANCHISE_PILLARS.map((pillar, index) => (
              <RevealItem
                as="li"
                key={pillar.title}
                className={`grid gap-x-12 gap-y-4 border-t border-bone-line py-9 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.4fr)] ${
                  index === FRANCHISE_PILLARS.length - 1 ? "border-b" : ""
                }`}
              >
                <p className="numeral text-crimson" style={{ fontSize: "clamp(2.25rem,3vw,3rem)" }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display-4 self-center">{pillar.title}</h3>
                <p className="body-lg self-center text-ink-soft">
                  {pillar.sourced}
                  {pillar.drafted}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

        </div>
      </Band>

      <Band tone="dark" className="band-pad">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <Eyebrow className="text-amber">The proof</Eyebrow>
            <h2 className="display-2 mt-6 max-w-[14ch] text-cream">
              {TOTAL_STORE_COUNT} cafés already running.
            </h2>
            <p className="body-lg mt-6 max-w-md text-cream-soft">
              Beydan trades across {CITIES.join(", ")} on a single operating
              model — brand, supply and staffing built and proven before the
              first partner site opens.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="lg:border-l lg:border-timber-line lg:pl-20">
            <h2 className="display-3 text-cream">Start a conversation</h2>
            <p className="body-lg mt-5 max-w-md text-cream-soft">
              Tell us the city you have in mind and how you plan to operate
              there. Enquiries go straight to the team at {CONTACT.email}.
            </p>
            <CtaRow className="mt-8">
              <Cta href={FRANCHISE_MAILTO} arrow="right">
                Email the franchise team
              </Cta>
            </CtaRow>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
