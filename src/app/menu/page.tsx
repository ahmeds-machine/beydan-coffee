import type { Metadata } from "next";

import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";
import { MediaFrame } from "@/components/media-frame";
import { MenuExplorer, type MenuCategoryView } from "@/components/menu-explorer";
import { Parallax } from "@/components/parallax";
import { LineReveal, Reveal } from "@/components/reveal";
import { MENU } from "@/data/menu";
import { MENU_HERO } from "@/data/site";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Menu",
  description: MENU_HERO.body,
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ menu?: string }>;
}) {
  // Deep-linking a category is server-rendered so a shared link opens on the
  // right tab; switching after that is instant and client-side.
  const { menu } = await searchParams;
  const initialCategory =
    MENU.find((category) => category.slug === menu)?.slug ?? MENU[0].slug;

  const categories: MenuCategoryView[] = MENU.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      media: resolveMedia(
        `product-${item.slug}`,
        `${item.name} at Beydan Coffee`,
        `${item.name} — close-up product shot`,
      ),
    })),
  }));

  const heroMedia = resolveMedia(
    "menu-hero",
    "Iced drinks on a Beydan counter",
    "Menu hero — iced drinks, shallow depth of field",
  );

  return (
    <>
      <Band tone="dark" className="pt-36 pb-0 lg:pt-44">
        <div className="shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <Reveal>
                <Eyebrow className="text-amber">{MENU_HERO.eyebrow}</Eyebrow>
              </Reveal>
              <LineReveal
                lines={MENU_HERO.headline}
                as="h1"
                mode="mount"
                delay={0.1}
                className="display-1 mt-7 text-cream"
              />
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="body-lg max-w-md text-cream-soft">{MENU_HERO.body}</p>
              <CtaRow className="mt-8">
                <Cta href="/locations" arrow="right">
                  Order at your nearest café
                </Cta>
              </CtaRow>
            </Reveal>
          </div>
        </div>

        <div className="shell mt-14">
          <Reveal distance={30}>
            <Parallax distance={24}>
              <MediaFrame
                media={heroMedia}
                priority
                sizes="(min-width: 1440px) 1200px, 92vw"
                className="aspect-[16/9] rounded-t-3xl lg:aspect-[21/9]"
              />
            </Parallax>
          </Reveal>
        </div>
      </Band>

      <Band tone="light" className="band-pad">
        <div className="shell">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>The full menu</Eyebrow>
            </Reveal>
            <LineReveal
              lines={["Pick a counter", "to browse."]}
              className="display-2 mt-6"
            />
          </div>

          <Reveal className="mt-12" distance={26}>
            <MenuExplorer
              categories={categories}
              initialCategory={initialCategory}
            />
          </Reveal>

        </div>
      </Band>
    </>
  );
}
