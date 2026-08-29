import Link from "next/link";
import type { Metadata } from "next";
import { Briefcase, Mail, MapPin } from "lucide-react";

import { Band, Eyebrow } from "@/components/band";
import { ContactMap } from "@/components/contact-map";
import { SOCIAL_ICONS } from "@/components/brand-icons";
import { Cta, CtaRow } from "@/components/cta";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { CALLABLE_LOCATIONS, CITIES, LOCATIONS, TOTAL_STORE_COUNT } from "@/data/locations";
import { CONTACT, CONTACT_COPY, SOCIAL_LINKS } from "@/data/site";
import { telHref } from "@/lib/maps";

export const metadata: Metadata = {
  title: "Contact Us",
  description: CONTACT_COPY.body,
};

export default function ContactPage() {
  return (
    <>
      <Band tone="dark" className="pt-36 pb-24 lg:pt-48 lg:pb-32">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">Contact</Eyebrow>
              </Reveal>
              <LineReveal
                lines={["We’d love to", "hear from you."]}
                as="h1"
                mode="mount"
                delay={0.1}
                className="display-1 mt-7 text-cream"
              />
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">
                {CONTACT_COPY.body}
              </p>
              <CtaRow className="mt-8">
                <Cta href={`mailto:${CONTACT.email}`} arrow="right">
                  Email the team
                </Cta>
              </CtaRow>
            </Reveal>
          </div>
        </div>
      </Band>

      <Band tone="light" className="band-pad">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Reach us</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["Three ways in."]}
              className="display-2 mt-6"
            />

            <RevealGroup as="ul" className="mt-10 flex flex-col gap-3" stagger={0.08}>
              <RevealItem as="li">
                <ContactRow
                  icon={<Mail className="size-5" aria-hidden="true" />}
                  href={`mailto:${CONTACT.email}`}
                  title={CONTACT.email}
                  note="General enquiries, events and press"
                />
              </RevealItem>
              <RevealItem as="li">
                <ContactRow
                  icon={<Briefcase className="size-5" aria-hidden="true" />}
                  href="/careers"
                  title={CONTACT_COPY.careersPrompt}
                  note="Applications and open roles"
                  internal
                />
              </RevealItem>
              <RevealItem as="li">
                <ContactRow
                  icon={<MapPin className="size-5" aria-hidden="true" />}
                  title={CONTACT.headquarters}
                  note="Head office"
                />
              </RevealItem>
            </RevealGroup>

            <Reveal className="mt-12">
              <Eyebrow>Follow</Eyebrow>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-bone-line px-4 text-[0.875rem] font-semibold transition-colors hover:border-crimson hover:bg-crimson hover:text-white"
                      >
                        <Icon className="size-4" />
                        {social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-bone-line bg-bone-deep">
                <div className="aspect-[4/3] w-full">
                  <ContactMap />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bone-line p-5">
                  <p className="body-base text-ink-soft">
                    {TOTAL_STORE_COUNT} cafés across{" "}
                    <span className="font-semibold text-ink">
                      {CITIES.join(", ")}
                    </span>
                  </p>
                  <Cta href="/locations" variant="ghost" arrow="right">
                    Café directory
                  </Cta>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* Calling a specific café is usually what someone actually wants. */}
      <Band tone="light" surface="deep" className="band-pad">
        <div className="shell">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>Call a café directly</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["Straight through", "to the counter."]}
              className="display-2 mt-6"
            />
          </div>

          <Reveal delay={0.05}>
            <p className="body-base mt-6 max-w-prose text-ink-soft">
              {CALLABLE_LOCATIONS.length} of our {LOCATIONS.length} cafés have a
              live line. The rest are being connected — until then, use the
              directions on the café directory or email us.
            </p>
          </Reveal>

          <RevealGroup
            as="ul"
            className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.07}
          >
            {CALLABLE_LOCATIONS.map((store) => (
              <RevealItem as="li" key={store.slug}>
                <a
                  href={telHref(store.phone!)}
                  className="flex min-h-11 flex-col gap-1 rounded-2xl border border-bone-line bg-bone p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-crimson"
                >
                  <span className="display-4">{store.name}</span>
                  <span className="body-base text-ink-soft">{store.address}</span>
                  <span className="mt-2 font-semibold text-crimson">
                    {store.phone}
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Band>
    </>
  );
}

function ContactRow({
  icon,
  href,
  title,
  note,
  internal = false,
}: {
  icon: React.ReactNode;
  href?: string;
  title: string;
  note: string;
  internal?: boolean;
}) {
  const body = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-crimson/10 text-crimson">
        {icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        <span className="body-base text-ink-soft">{note}</span>
      </span>
    </>
  );

  const className =
    "flex min-h-16 items-center gap-4 rounded-2xl border border-bone-line bg-card p-4 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-crimson";

  if (!href) {
    return <div className={className}>{body}</div>;
  }

  if (internal) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {body}
    </a>
  );
}
