import type { Metadata } from "next";

import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";
import { FannedGallery } from "@/components/fanned-gallery";
import { AmbientVideo } from "@/components/ambient-video";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { CITIES, TOTAL_STORE_COUNT } from "@/data/locations";
import { STORY_PARAGRAPHS } from "@/data/site";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description: STORY_PARAGRAPHS[0],
};

/**
 * The origin story, told as a sequence.
 *
 * Every milestone below is drawn from the live site’s "Our Story" copy — the
 * home bakery in February 2018, the shift to a full coffeehouse, and the
 * continental ambition. Nothing is added that the brand has not published.
 */
const MILESTONES = [
  {
    marker: "2018",
    title: "A home bakery in Mogadishu",
    body: "Beydan begins in February, handcrafting premium desserts for local homes, hotels and offices.",
  },
  {
    marker: "Then",
    title: "A full coffeehouse",
    body: "A love of coffee and connection turns the bakery into a café: artisanal coffee, freshly baked goods, and service that reflects Africa’s warmth.",
  },
  {
    marker: "Now",
    title: `${TOTAL_STORE_COUNT} cafés, ${CITIES.length} cities`,
    body: `Beydan trades across ${CITIES.join(", ")} as Somalia’s leading coffee brand.`,
  },
  {
    marker: "Next",
    title: "A continental network",
    body: "Flagship cafés across Africa that celebrate African coffee origins, local ingredients and world-class design.",
  },
] as const;

export default function AboutPage() {
  const BRAND_VIDEO = [
    { src: "/videos/about-brand.webm", type: "video/webm" },
    { src: "/videos/about-brand.mp4", type: "video/mp4" },
  ] as const;

  // This slot carries footage rather than a still. WebM first for the better
  // compression; the MP4 is there for iOS Safari, which only gained WebM
  // playback in 17.4.
  const ROOM_VIDEO = [
    { src: "/videos/about-room.webm", type: "video/webm" },
    { src: "/videos/about-room.mp4", type: "video/mp4" },
  ] as const;

  const gallery = [
    // The first two slots were captioned "Roasting" and "Bakery, hands".
    // Neither shot exists in the supplied photography, so both are named for
    // what they actually hold rather than for a photograph that is not there.
    //
    // The first is also keyed by content rather than slot number: it replaced
    // an earlier photo, and reusing the filename left browsers serving the old
    // image from cache. A new name means a new URL, which no cache can answer
    // stale — do the same for any future swap.
    resolveMedia(
      "about-bakes-tray",
      "A tray of chocolate-studded pastries fresh from the oven",
      "Fresh Bakes",
    ),
    resolveMedia(
      "about-gallery-2",
      "A grilled chicken salad with olives, cucumber and lettuce, from above",
      "Plated Fresh",
    ),
    resolveMedia(
      "about-gallery-3",
      "A Beydan salad and branded coffee cup on a wood table",
      "Salad and a cup, on the table",
    ),
  ];

  return (
    <>
      <Band tone="dark" className="pt-36 pb-24 lg:pt-48 lg:pb-32">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">Our Story</Eyebrow>
              </Reveal>
              <LineReveal
                lines={["Africa’s own talent,", "flavours and", "hospitality."]}
                as="h1"
                mode="mount"
                delay={0.1}
                className="display-1 mt-7 text-cream"
              />
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">
                {STORY_PARAGRAPHS[0]}
              </p>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* Story proper: a narrow measure of type against a tall portrait. */}
      <Band tone="light" className="band-pad">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
          {/*
            Deliberately not wrapped in Parallax. That wrapper translates its
            child vertically as the section scrolls, which left this card
            sitting above the text column's top edge at every scroll position.
            A vertical parallax offset and a shared top edge cannot coexist.
          */}
          <Reveal>
            <AmbientVideo
              sources={BRAND_VIDEO}
              poster="/images/about-brand-poster.jpg"
              label="The Beydan Coffee rooftop terrace at dusk, its lit sign overlooking the mosque plaza"
              className="aspect-[3/4] rounded-2xl"
            />
          </Reveal>

          <div>
            <RevealGroup className="flex flex-col gap-6">
              {STORY_PARAGRAPHS.map((paragraph) => (
                <RevealItem key={paragraph.slice(0, 40)}>
                  <p className="body-lg max-w-prose text-ink-soft">{paragraph}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-12">
              <blockquote className="border-l-2 border-crimson pl-6">
                <p className="display-3 max-w-[18ch]">
                  Somalia&rsquo;s leading coffee brand.
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* Timeline — a real sequence, so ordered markers earn their place. */}
      <Band tone="dark" className="band-pad">
        <div className="shell">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow className="text-amber">From 2018</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["How a bakery became", "a coffee company."]}
              className="display-2 mt-6 text-cream"
            />
          </div>

          <RevealGroup as="ol" className="mt-16 flex flex-col" stagger={0.1}>
            {MILESTONES.map((milestone, index) => (
              <RevealItem
                as="li"
                key={milestone.marker}
                className={`grid gap-x-10 gap-y-3 border-t border-timber-line py-8 lg:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.1fr)] ${
                  index === MILESTONES.length - 1 ? "border-b" : ""
                }`}
              >
                <p className="display-4 text-crimson">{milestone.marker}</p>
                <h3 className="display-4 text-cream">{milestone.title}</h3>
                <p className="body-lg text-cream-soft">{milestone.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Band>

      {/* Sourcing: framed honestly — the ambition is published, the specifics
          are not. */}
      <Band tone="light" surface="deep" className="band-pad">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Origin &amp; roast</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["Coffee that celebrates", "African origins."]}
              className="display-2 mt-6 max-w-[16ch]"
            />
            <Reveal delay={0.1}>
              <p className="body-lg mt-8 max-w-prose text-ink-soft">
                Beydan is building a continental network of flagship cafés that
                celebrate African coffee origins, local ingredients and
                world-class design — with roasting, bakery production and supply
                handled in-house.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 rounded-2xl border border-dashed border-bone-line bg-bone p-7">
                <p className="eyebrow text-crimson">Needs content</p>
                <p className="body-base mt-3 max-w-prose text-ink-soft">
                  Beydan has not published its origin regions, farm partners,
                  altitudes, roast profiles or tasting notes. Rather than invent
                  a farm-to-cup story, this section stays at the level the brand
                  itself states. Supply the sourcing detail and it slots in here.
                </p>
              </div>
            </Reveal>

            <CtaRow className="mt-10">
              <Cta href="/menu" arrow="right">
                See what we pour
              </Cta>
            </CtaRow>
          </div>

          <Reveal delay={0.1}>
            <AmbientVideo
              sources={ROOM_VIDEO}
              poster="/images/about-room-poster.jpg"
              label="Behind the bar at Beydan: branded cups stacked, milk steaming, and espresso tamped and poured"
              className="aspect-[4/5] rounded-2xl"
            />
          </Reveal>
        </div>
      </Band>

      <Band tone="light" className="band-pad">
        <div className="shell">
          <Reveal>
            <Eyebrow>Inside the cafés</Eyebrow>
          </Reveal>
          <FannedGallery items={gallery} className="mt-12" />
        </div>
      </Band>
    </>
  );
}
