import type { Metadata } from "next";

import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";
import { FactsRow } from "@/components/facts-row";
import { FannedGallery } from "@/components/fanned-gallery";
import { LocationCard } from "@/components/location-card";
import { LocationsRail, RailItem } from "@/components/locations-rail";
import { HeroGallery } from "@/components/hero-gallery";
import { AmbientVideo } from "@/components/ambient-video";
import { PhotoCarousel } from "@/components/photo-carousel";
import { SignatureCoverflow } from "@/components/signature-coverflow";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { LOCATIONS, TOTAL_STORE_COUNT } from "@/data/locations";
import { SIGNATURE_ITEMS } from "@/data/menu";
import {
  FACTS,
  HERO,
  LOCATIONS_INTRO,
  NUMBERS_GALLERY,
  STORY_PARAGRAPHS,
} from "@/data/site";
import { resolveMedia } from "@/lib/media";
import { placeholderImage } from "@/lib/placeholder-image";

export const metadata: Metadata = {
  description: HERO.body,
};

/**
 * The five hero panels. Each is an explicit placeholder until real photography
 * is supplied — drop a matching file into public/images and it takes over.
 */
const HERO_PANELS = [
  {
    name: "hero-cafe-interior",
    caption: "Flagship interior",
    label: "Our Flagship",
    subject: "Flagship café interior, wide",
    alt: "Guests seated among wood shelving and terrazzo floors at a Beydan café",
  },
  {
    name: "hero-roasting",
    caption: "Behind the bar",
    label: "Behind the Bar",
    subject: "The espresso bar mid-service",
    alt: "Staff and customers around the red espresso machine at a Beydan café",
  },
  {
    name: "hero-product",
    caption: "In the hand",
    label: "Crafted by Hand",
    subject: "A branded latte, held",
    alt: "A henna-decorated hand holding a Beydan latte with rosetta art",
  },
  {
    name: "hero-community",
    caption: "In the room",
    label: "Community First",
    subject: "Working in the room",
    alt: "A guest working on a laptop with a Beydan cup on the table",
  },
  {
    // No exterior photography exists in the first batch, so this slot carries
    // a team photograph and is named for what it actually shows. Swap in a
    // real storefront — and rename back — when one is supplied.
    name: "hero-people",
    caption: "Our people",
    label: "Our People",
    subject: "A barista at the steam wand",
    alt: "A Beydan barista smiling while steaming milk",
  },
] as const;

export default function HomePage() {
  const heroPanels = HERO_PANELS.map((panel) => {
    const media = resolveMedia(panel.name, panel.alt, panel.subject);
    return {
      image:
        media.src ??
        placeholderImage({ name: panel.name, caption: panel.caption }),
      // Never describe a photograph that is not there.
      alt: media.src
        ? panel.alt
        : `Placeholder — ${panel.subject}. No image supplied yet.`,
      label: panel.label,
    };
  });

  // Footage rather than a still, matching the About page's Origin & roast
  // card. WebM first for the compression; the MP4 covers iOS Safari, which
  // only gained WebM playback in 17.4.
  const STORY_VIDEO = [
    { src: "/videos/story-counter.webm", type: "video/webm" },
    { src: "/videos/story-counter.mp4", type: "video/mp4" },
  ] as const;

  // Titles are set on two lines in the coverflow, so the last word drops to a
  // smaller second line: "Iced Matcha / Latte". Single-word names keep one.
  const signatureItems = SIGNATURE_ITEMS.map((item) => {
    const words = item.name.toUpperCase().split(" ");
    const titleLine2 = words.length > 1 ? words.pop() : undefined;

    return {
      key: item.slug,
      titleLine1: words.join(" "),
      titleLine2,
      ctaText: "View menu",
      ctaUrl: "/menu",
      media: resolveMedia(
        `product-${item.slug}`,
        `${item.name} at Beydan Coffee`,
        `${item.name} — close-up product shot`,
      ),
    };
  });

  const numbersGallery = NUMBERS_GALLERY.map((photo) => ({
    ...resolveMedia(photo.name, `${photo.shot}, Beydan Coffee`, photo.shot),
    // Only the shots whose subject sits off-centre carry one.
    focus: "focus" in photo ? photo.focus : undefined,
  }));

  // Slots 5 and 6 were "Beans, macro" and "Storefront". Neither shot exists in
  // the supplied batch, so they are named for what they actually hold rather
  // than captioned for a photograph that is not there. Rename them back when a
  // real beans macro and a real storefront are shot.
  const gallery = [
    // Keyed by content, not slot number: it replaced an earlier photo, and
    // reusing a filename leaves browsers serving the old image from cache.
    resolveMedia(
      "gallery-people",
      "Two guests with Beydan cups, one personalised “Safiya”, over a croissant and a cookie",
      "The people",
    ),
    resolveMedia("gallery-2", "Mint tea steaming in a glass", "The pour, close"),
    resolveMedia(
      "gallery-3",
      "A customer served at the Beydan counter beneath the menu boards",
      "Bakery counter",
    ),
    resolveMedia(
      "gallery-4",
      "Guests working beneath the “Coffee. Smile. Laugh. Repeat.” wall",
      "Guests, candid",
    ),
    resolveMedia(
      "gallery-5",
      "A team member in a Beydan apron holding a cup of tea",
      "Team, close",
    ),
    resolveMedia(
      "gallery-6",
      "The banquette corner with a plant at a Beydan café",
      "Lounge corner",
    ),
  ];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* HERO — espresso band, oversized serif, image breaking the bottom edge */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="dark" className="z-10 overflow-visible pt-36 pb-0 lg:pt-44">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">{HERO.eyebrow}</Eyebrow>
              </Reveal>

              <LineReveal
                lines={HERO.headline}
                as="h1"
                mode="mount"
                delay={0.12}
                className="display-1 mt-7 text-cream"
              />
            </div>

            {/* Supporting copy sits beside the headline, not centred beneath it. */}
            <Reveal delay={0.35} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">{HERO.body}</p>
              <CtaRow className="mt-8">
                <Cta href="/locations" arrow="right">
                  Find a café near you
                </Cta>
                <Cta href="/contact" variant="ghost">
                  Contact us
                </Cta>
              </CtaRow>
            </Reveal>
          </div>
        </div>

        {/* The gallery breaks out of the dark block and hangs over the band
            below — the hero band carries the z-index so it stays on top. */}
        <div className="shell relative z-10 mt-6 -mb-16 lg:mt-8 lg:-mb-24">
          <Reveal delay={0.2} distance={34}>
            <HeroGallery panels={heroPanels} />
          </Reveal>
        </div>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* OUR STORY — bone band                                               */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="light" className="band-pad">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
            <div>
              <Reveal>
                <Eyebrow>Our Story</Eyebrow>
              </Reveal>

              <LineReveal
                lines={["A coffee company", "born in Mogadishu."]}
                className="display-2 mt-7 max-w-[16ch]"
              />

              <RevealGroup className="mt-9 flex max-w-prose flex-col gap-5">
                {STORY_PARAGRAPHS.map((paragraph) => (
                  <RevealItem key={paragraph.slice(0, 40)}>
                    <p className="body-lg text-ink-soft">{paragraph}</p>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal className="mt-10">
                <Cta href="/about" variant="ghost">
                  Read the full story
                </Cta>
              </Reveal>
            </div>

            {/*
              Deliberately not wrapped in Parallax. That wrapper translates its
              child vertically by ±30px as the section scrolls, which left the
              video card sitting above the text column's top edge at every
              scroll position. A vertical parallax offset and a shared top edge
              are mutually exclusive, and the alignment matters more here.
            */}
            <Reveal delay={0.1}>
              <AmbientVideo
                sources={STORY_VIDEO}
                poster="/images/story-counter-poster.jpg"
                label="A barista pulling espresso and finishing a latte at the Beydan counter"
                className="aspect-[4/5] rounded-2xl"
              />
            </Reveal>
          </div>
        </div>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* SIGNATURE OFFERINGS — espresso band                                 */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="dark" className="band-pad">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">Signature Offerings</Eyebrow>
              </Reveal>
              <LineReveal
                lines={["Four things worth", "crossing town for."]}
                className="display-2 mt-6 max-w-[15ch] text-cream"
              />
            </div>

            <Reveal delay={0.15}>
              <Cta href="/menu" arrow="right">
                See the full menu
              </Cta>
            </Reveal>
          </div>

          <Reveal className="mt-14" distance={26}>
            <SignatureCoverflow
              items={signatureItems}
              sectionLabel="Signature offerings"
            />
          </Reveal>
        </div>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* BY THE NUMBERS — bone band, oversized numerals                      */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="light" surface="deep" className="band-pad">
        <div className="shell">
          <Reveal>
            <Eyebrow>Beydan by the numbers</Eyebrow>
          </Reveal>
          {/* Figures on the left, one shared carousel beside them on the
              right. Below `lg` there is no room for two columns, so the
              carousel falls back to sitting under the stack. */}
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
            <FactsRow facts={FACTS} />

            <Reveal delay={0.1}>
              <PhotoCarousel
                photos={numbersGallery}
                label="Beydan by the numbers — photographs"
              />
            </Reveal>
          </div>
        </div>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* LOCATIONS — bone band, live status rail                             */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="light" className="band-pad">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <Reveal>
                <Eyebrow>Locations</Eyebrow>
              </Reveal>
              <LineReveal
                lines={[`${TOTAL_STORE_COUNT} cafés,`, "three cities."]}
                className="display-2 mt-6"
              />
              <Reveal delay={0.1}>
                <p className="body-lg mt-6 text-ink-soft">{LOCATIONS_INTRO}</p>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <Cta href="/locations" arrow="right">
                See every café
              </Cta>
            </Reveal>
          </div>

          <Reveal className="mt-14" distance={30}>
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

      {/* ------------------------------------------------------------------ */}
      {/* GALLERY — bone band, fanned frames                                  */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="light" surface="deep" className="band-pad">
        <div className="shell">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>Inside Beydan</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["The rooms, the", "roast, the people."]}
              className="display-2 mt-6"
            />
          </div>

          <FannedGallery items={gallery} className="mt-16" />
        </div>
      </Band>

      {/* ------------------------------------------------------------------ */}
      {/* FRANCHISE + CAREERS — espresso band, split                          */}
      {/* ------------------------------------------------------------------ */}
      <Band tone="dark" className="band-pad">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow className="text-amber">Franchising</Eyebrow>
            <h2 className="display-3 mt-6 text-cream">
              Bring Beydan Coffee to your city.
            </h2>
            <p className="body-lg mt-5 max-w-md text-cream-soft">
              A centrally operated café system — brand, supply and operations
              already built — ready for partners across Africa.
            </p>
            <CtaRow className="mt-8">
              <Cta href="/franchise" arrow="right">
                Start a conversation
              </Cta>
            </CtaRow>
          </Reveal>

          <Reveal delay={0.12} className="lg:border-l lg:border-timber-line lg:pl-20">
            <Eyebrow className="text-amber">Careers</Eyebrow>
            <h2 className="display-3 mt-6 text-cream">
              Come and work the bar.
            </h2>
            <p className="body-lg mt-5 max-w-md text-cream-soft">
              Bakers, roasters, baristas and leaders — every role plays a part in
              our story of growth and quality.
            </p>
            <CtaRow className="mt-8">
              <Cta href="/careers" variant="ghost" arrow="right">
                Send your CV
              </Cta>
            </CtaRow>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
