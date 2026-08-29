import type { Metadata } from "next";

import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";
import { MediaFrame } from "@/components/media-frame";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { CAREERS_CULTURE, CAREERS_HERO, CONTACT } from "@/data/site";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Careers",
  description: CAREERS_HERO.body,
};

const CV_MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "CV — Beydan Coffee",
)}&body=${encodeURIComponent(
  "Role you’re after:\nCafé or city:\nA line about you:\n\n(Please attach your CV.)",
)}`;

/**
 * The teams named in the live site’s culture copy: bakers, roasters, leaders,
 * baristas, plus the bakery, accounting office and roasting centre. No roles
 * are invented and no vacancies are implied — the site does not list any.
 */
const TEAMS = [
  "Baristas",
  "Bakers",
  "Roasters",
  "Café leadership",
  "Accounting",
  "Roasting centre",
] as const;

export default function CareersPage() {
  const heroMedia = resolveMedia(
    "careers-hero",
    "The Beydan team behind the bar",
    "Team behind the bar, mid-service",
  );

  return (
    <>
      <Band tone="dark" className="pt-36 pb-24 lg:pt-48 lg:pb-32">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">{CAREERS_HERO.eyebrow}</Eyebrow>
              </Reveal>
              <LineReveal
                lines={CAREERS_HERO.headline}
                as="h1"
                mode="mount"
                delay={0.1}
                className="display-1 mt-7 text-cream"
              />
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">
                {CAREERS_HERO.body}
              </p>
              <CtaRow className="mt-8">
                <Cta href={CV_MAILTO} arrow="right">
                  Send your CV
                </Cta>
              </CtaRow>
            </Reveal>
          </div>
        </div>
      </Band>

      <Band tone="light" className="band-pad">
        <div className="shell">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{CAREERS_CULTURE.eyebrow}</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["Craftsmanship, passion,", "and purpose."]}
              className="display-2 mt-6"
            />
          </div>

          <RevealGroup
            className="mt-12 grid gap-x-16 gap-y-6 md:grid-cols-2"
            stagger={0.1}
          >
            {CAREERS_CULTURE.columns.map((column) => (
              <RevealItem key={column.slice(0, 40)}>
                <p className="body-lg text-ink-soft">{column}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16" distance={28}>
            <MediaFrame
              media={heroMedia}
              sizes="(min-width: 1440px) 1200px, 92vw"
              className="aspect-[16/9] rounded-2xl lg:aspect-[21/9]"
            />
          </Reveal>
        </div>
      </Band>

      <Band tone="light" surface="deep" className="band-pad">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Where people work</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["Every role plays", "a part."]}
              className="display-2 mt-6 max-w-[14ch]"
            />

            <RevealGroup as="ul" className="mt-10 flex flex-wrap gap-2.5" stagger={0.05}>
              {TEAMS.map((team) => (
                <RevealItem as="li" key={team}>
                  <span className="inline-flex min-h-11 items-center rounded-full border border-bone-line bg-bone px-5 text-[0.875rem] font-semibold">
                    {team}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div>
            <Reveal>
              <div className="rounded-2xl border border-bone-line bg-bone p-8">
                <h2 className="display-3">Send your CV</h2>
                <p className="body-lg mt-4 text-ink-soft">
                  Beydan does not publish a vacancy list, so applications go
                  directly to the team. Tell us the role you want and the café
                  or city you&rsquo;d like to work in, and attach your CV.
                </p>
                <CtaRow className="mt-8">
                  <Cta href={CV_MAILTO} arrow="right">
                    Email {CONTACT.email}
                  </Cta>
                </CtaRow>
              </div>
            </Reveal>

          </div>
        </div>
      </Band>
    </>
  );
}
