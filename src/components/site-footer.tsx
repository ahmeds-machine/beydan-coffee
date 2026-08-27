import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { Band, Eyebrow } from "@/components/band";
import { SOCIAL_ICONS } from "@/components/brand-icons";
import { Cta } from "@/components/cta";
import { Logo } from "@/components/logo";
import { APP_LINKS, CONTACT, NAV_LINKS, SOCIAL_LINKS } from "@/data/site";
import { CITIES, TOTAL_STORE_COUNT } from "@/data/locations";

export function SiteFooter() {
  return (
    <Band as="footer" tone="dark" className="pt-20 pb-10">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <Logo onDark width={148} />
            <p className="body-lg mt-6 max-w-md text-cream-soft">
              {TOTAL_STORE_COUNT} cafés across {CITIES.join(", ")} — and a
              continental network still being built.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex min-h-11 items-center gap-3 text-cream transition-colors hover:text-crimson"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-timber-line">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                {CONTACT.email}
              </a>
              <p className="inline-flex min-h-11 items-center gap-3 text-cream-soft">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-timber-line">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                {CONTACT.headquarters}
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer">
              <Eyebrow className="text-cream-soft" withRake={false}>
                Explore
              </Eyebrow>
              <ul className="mt-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-cream-soft transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <Eyebrow className="text-cream-soft" withRake={false}>
                Follow
              </Eyebrow>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid size-11 place-items-center rounded-full border border-timber-line text-cream-soft transition-colors hover:border-crimson hover:bg-crimson hover:text-white"
                      >
                        <Icon className="size-4" />
                        <span className="sr-only">
                          Beydan Coffee on {social.label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-9">
                <Eyebrow className="text-cream-soft" withRake={false}>
                  Beydan app
                </Eyebrow>
                <div className="mt-5 flex flex-col gap-2.5">
                  <AppBadge store="App Store" href={APP_LINKS.appStore} />
                  <AppBadge store="Google Play" href={APP_LINKS.googlePlay} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-timber-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="body-base text-cream-soft">{CONTACT.copyright}</p>
          <Cta href="/franchise" variant="ghost" className="text-cream">
            Open a Beydan in your city
          </Cta>
        </div>
      </div>
    </Band>
  );
}

/**
 * The live site shows official App Store and Google Play badges, but the
 * screenshots expose neither the artwork nor the target URLs. Rather than
 * redrawing the badges or inventing links, the slot renders as a labelled,
 * inert placeholder until real values are supplied.
 */
function AppBadge({ store, href }: { store: string; href: string | null }) {
  const label = `Get the Beydan app on ${store}`;

  if (!href) {
    return (
      <span
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-dashed border-timber-line px-4 py-2 text-[0.8rem] text-cream-soft"
        title={`${label} — link not published yet`}
      >
        {store}
        <span className="eyebrow rounded-full bg-timber px-2 py-1 text-[0.5rem]">
          Link needed
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 w-fit items-center rounded-full border border-timber-line px-4 py-2 text-[0.8rem] text-cream transition-colors hover:border-crimson hover:bg-crimson hover:text-white"
    >
      {label}
    </a>
  );
}
