# Beydan Coffee — website rebuild

A modernization of beydancoffee.com. The real content — locations, phone
numbers, hours, menu names, story — is reproduced from the current site; the
craft, motion and interactivity around it are new.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui (Base UI) ·
Framer Motion · GSAP (for the hero gallery only).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm test           # store-hours logic
npm run test:tz    # the same suite under five runtime timezones
npm run typecheck
npm run lint
```

---

## The two things to hand over next

**1. The logo — two separate assets, not one.**

*The wordmark.* `public/brand/logo-from-screenshot.png` is the real BEYDAN
wordmark, extracted pixel-for-pixel from the live site's own header and matted
off its white background — it was not redrawn, traced or approximated in code.
But it is only 132px wide, so it is capped at its native size and will not
survive being scaled up. **Drop in the official vector and update the import in
`src/components/logo.tsx`.** The favicon and Apple touch icon
(`src/app/icon.png`, `src/app/apple-icon.png`) are cut from the same source and
should be regenerated from the vector at the same time.

*The map submark.* The map pins use a **different** brand asset: a "B"
silhouette carrying a diagonal red/black/gold stripe, at
`public/markers/beydan-b-mark.svg`. It is not the horizontal wordmark, so
asking the client for "the logo" will not produce it — **request the pin
submark explicitly.** The file in the repo is a practical recreation made from
a screenshot rather than the client's original artwork: fine to ship with,
and to be replaced the moment the real one arrives. Swapping it is a
file-for-file drop — nothing in code needs to change.

**2. Photography.** No images shipped with the brief, so every image slot draws
a designed placeholder that names what belongs there. Drop a file into
`public/images/` matching the slot's name and it is picked up on the next build
— no code change. `.avif` and `.webp` win over `.jpg`/`.png` when both exist.

| File name | Slot |
| --- | --- |
| `hero-cafe-interior`, `hero-roasting`, `hero-product`, `hero-community`, `hero-exterior` | The five hero accordion panels, in order |
| `story-counter` | Home "Our Story" portrait |
| `product-cortado`, `product-iced-matcha-latte`, `product-lotus-tres-leche`, `product-tropical-chicken-salad` | Signature offerings + menu cards |
| `fact-stores-trading`, `fact-cities`, `fact-founded` | Circular thumbnails on the numbers row |
| `gallery-1` … `gallery-6` | Home fanned gallery |
| `about-portrait`, `about-room`, `about-gallery-1` … `-3` | About page |
| `menu-hero`, `franchise-hero`, `careers-hero` | Page heroes |

---

## Content provenance

Everything on the site is either transcribed from the live site or explicitly
marked. Nothing is invented.

### Verbatim from the current site
Nav, hero, "Our Story" (all three paragraphs), menu hero, the four signature
offering names, the locations intro, the franchise hero and section headings,
the careers hero and both "Our Culture" columns, the contact copy, email, HQ
and copyright.

All **11 store names, addresses, weekly hours and phone numbers** are
transcribed exactly: stores 1–4 from the live site's carousel, stores 5–11 as
supplied directly.

Apostrophes were normalised to the typographic form (`’`). The words are
unchanged.

### Drafted for this rebuild — review before launch
- **Franchise pillar copy.** The live site truncates each of the four pillars
  mid-sentence. The opening of every paragraph is verbatim; the closing clause
  was written in Beydan's voice. Both halves are stored separately in
  `src/data/site.ts` (`sourced` / `drafted`) and the page states this on-page.
- **Menu item descriptions.** Generic preparation notes ("espresso cut with an
  equal measure of warm steamed milk"), not claims about Beydan's recipes. Each
  item carries `copy: "drafted"` in `src/data/menu.ts`.
- **Section headings and link labels** written for the rebuild (e.g. "Four
  things worth crossing town for", "Find a café near you").

### Known gaps — marked `[NEEDS CONTENT]` in code and visible on the page
| Gap | Where |
| --- | --- |
| Store coordinates | `coordinates` is `null` in `src/data/locations.ts`. Directions fall back to an address query, and the contact map pins city centres rather than cafés — **these are approximations, not surveyed positions** |
| The map pin submark | `public/markers/beydan-b-mark.svg` is a recreation from a screenshot, not the client's source artwork. Drop the real file in its place |
| Full menu — only the four signature item names are legible on the live site | `src/data/menu.ts`; category pills show honest counts, including `Cold Brews 0` |
| Prices | No prices appear anywhere on the live site |
| Dietary information | The badge system is built and renders the moment `diets` are populated; nothing is guessed |
| Confirmation of the "Kitchen" category name | The salad is a signature offering but its category is never named |
| App Store / Google Play URLs | Footer badges render inert and labelled |
| Coffee sourcing specifics — origins, farms, altitudes, roast profiles, tasting notes | The About page states the published ambition and marks the rest as missing |
| A careers inbox or vacancy list | "Send your CV" goes to `info@beydancoffee.com` |

---

## Design system

**Colour is sampled from the live site, not guessed.** Values were read out of
the screenshots pixel by pixel:

| Token | Value | Provenance |
| --- | --- | --- |
| `--beydan-crimson` | `#ab2733` | Sampled from every filled CTA on the live site |
| `--beydan-crimson-logo` | `#ad2329` | Sampled from the BEYDAN wordmark |
| `--beydan-amber-soft` | `#ffb76b` | Sampled from the product-card backdrops |
| `--beydan-espresso` | `#16120f` | Dark band field |
| `--beydan-bone` | `#faf6ef` | Light band field |

Full saturation, deliberately not muted.

**Bands.** Alternating espresso and bone sections are the core structural
device. `<Band tone="dark">` re-points the semantic colour tokens for its whole
subtree, so shadcn primitives nested inside adopt the espresso palette with no
per-instance overrides.

**Type.** Fraunces (variable, with its `SOFT` / `WONK` / `opsz` axes) set very
large and tight for display; Archivo for body and UI. Deliberately not Inter.

**The rake.** Three slashes at the angle of the ones inside the BEYDAN
logotype, used as the eyebrow marker and the mobile nav indicator. A derived
graphic device — it is never assembled into anything resembling the wordmark.

**The paired CTA.** A filled pill beside a circular outline button holding only
an arrow, everywhere a primary action appears. Both halves point at the same
destination, so they are rendered as a *single* link with two shapes rather
than two adjacent links with identical accessible names: one focus stop, one
announcement, same composition.

---

## The hero gallery

The hero is an interactive multi-panel accordion: five panels sit side by side,
collapsed, desaturated and tilted, and hovering or focusing one expands it into
the focal panel.

`src/components/AccordionGallery/` holds the React Bits component **verbatim**
— it is vendored, not authored here, and must not be edited. Two things sit
alongside it so it never has to be:

- `AccordionGallery.d.ts` declares its props, because it ships untyped and the
  inferred shape wrongly made `link` required. Purely additive.
- `src/components/hero-gallery.tsx` is a thin `"use client"` wrapper. The
  vendor file has no directive of its own; marking the wrapper pulls the whole
  subtree client-side without touching it.

The vendor `<img>` trips `@next/next/no-img-element`, so that one rule is
disabled for that directory alone in `eslint.config.mjs`.

Theme props mirror the design tokens rather than the component's defaults:
crimson `#ab2733` accent bar, espresso `#16120f` overlay, cream `#f7efe6`
labels. `defaultIndex` is `2`, so the hero loads with the middle panel already
expanded. Its built-in behaviour is left alone: hover on pointer devices,
tap/focus on touch, a vertical stack below 520px, arrow-key navigation, and
instant transitions under `prefers-reduced-motion`.

**Panel artwork is a placeholder, never stock photography.** The component
takes an image *URL*, so it cannot use `<MediaFrame>`. `src/lib/placeholder-image.ts`
generates an SVG data URI in the same visual language — warm espresso wash, the
rake motif, an "image needed" marker and the file name to supply. Its type is
deliberately tiny and centred: a collapsed panel reveals only a narrow strip
through the middle of the artwork, so anything wider clips mid-word. Alt text
says "Placeholder — …, no image supplied yet" rather than describing a
photograph that does not exist. There are no picsum or stock URLs anywhere.

## The primary navigation

`src/components/expandable-nav.tsx` — adapted from the ExpandableTabs pattern.
The spring-eased padding growth and the soft pill that fills in behind the
highlighted item are kept; the icons, the click-outside collapse and the local
selection state are not, because a navbar's items must stay visible at all
times and "which item is active" is a routing fact rather than component state.
It reads `usePathname()` and renders real links. No `usehooks-ts`; framer-motion
was already a dependency.

Two departures from the reference worth knowing:

- **One anchor per item.** The reference nests an animated `<span>` inside a
  `<Link>`, which puts `aria-current` on the span — where it means nothing.
  `motion.create(Link)` animates the anchor itself, so `href`, `aria-current`
  and the animation all sit on the element that is actually the link.
- **A persistent current-page bar.** The pill is shared by hover and active, so
  on its own the current page loses every visual cue the moment you hover
  something else. A small crimson bar under the active item is tied to the
  route only. Its width is fixed so it never has to animate alongside the
  padding.

Because one item grows exactly as another shrinks, the nav's total width holds
steady while the highlight moves (measured: 1px), so nothing around it shifts.
Focus drives the highlight as well as hover, and it falls back to the current
page on blur. The spring collapses to an instant transition under
`prefers-reduced-motion`.

Colours are scoped to the nav container as `--nav-active` (cream `#F7EFE6`,
16.4:1 on the header) and `--nav-muted` (`#B8AFA2`, 8.6:1) — both clear AA at
11px.

## The contact map

Leaflet + react-leaflet over OpenStreetMap tiles, framed to the whole country
from Hargeisa in the north-west to Mogadishu in the south-east. Loaded through
`next/dynamic` with `ssr: false` — Leaflet needs `window`, and this also keeps
it out of every other page's bundle.

**Themed, not embedded.** Default OSM tiles and Leaflet's square white controls
read as a third-party widget. `src/components/contact-map.css` grades the tiles
warm (`sepia(16%) saturate(76%) hue-rotate(-8deg)`) and rebuilds the zoom
controls as the site's 44px circular buttons. The filter is applied to
`.leaflet-tile-pane` only — filtering the whole container would wash out the
crimson pins and the popup text along with the map. OSM attribution is kept, as
required, and styled quietly.

**Three pins, one per city.** Nine of the eleven cafés are in Mogadishu, so
per-store pins would pile up at national zoom. Each pin carries its café count
and opens a popup listing that city's cafés, each linking to
`/locations#<slug>`. Mogadishu's nine scroll inside the popup rather than
overflowing the map. Anchors are set on the directory grid only — the rail
renders the same cards, and duplicate ids would make the anchor ambiguous.

**⚠️ The coordinates are approximations.** `src/data/cities.ts` holds
city-centre positions, not surveyed café locations, and says so in the file.
Geocode the real addresses before launch.

**The pin.** `public/markers/beydan-b-mark.svg` — the "B" submark with its
diagonal stripe — is referenced as a file rather than inlined or rasterised, so
it stays sharp at any device pixel ratio and can be reused at any size. It
renders at 33 × 40 (its native 120 × 146 aspect), and because the letterform
sits flush with the bottom of its viewBox, `iconAnchor` puts the **base of the
B** on the coordinate rather than its centre. A small dark badge carries the
café count, but only where a pin stands for more than one — Hargeisa and
Garoowe show a clean mark. The artwork is a recreation, not the client's source
file; see *The logo* above.

Wheel zoom is disabled so the map cannot hijack page scrolling; the +/− controls
remain. The map container and every pin carry accessible names, pins are
keyboard-reachable (`role="button"`, `tabindex="0"`), popup links are tabbable,
and a screen-reader-only paragraph states the same city breakdown as text.

## Two states the store cards handle

**A café with no phone line yet** (`phone: null` — Wadaadiid Mall, Aleen Square,
Tamam Park, Airport). The card says "Phone line coming soon" where the number
would be, and the Call and WhatsApp buttons are withheld rather than pointed at
a placeholder. Directions still work: the address is known either way. There
are no dead `tel:` or `wa.me` links anywhere on the site — a test asserts it.

**A café that has not opened** (`trading: false` — Airport). It has no schedule
at all, so there is nothing to compute a live status from. It shows a filled
"Opening soon" chip, visually distinct from the outlined live states and
static, because there is nothing to tick.

The contact page's "call a café directly" grid lists only the cafés with a live
line, and says how many of the eleven that is.

## Store hours and the live status badge

`src/lib/hours.ts` is the correctness-critical part of the build.

- Hours are stored as **store-local wall-clock minutes past midnight**, the
  only representation that survives visitors in other timezones.
- A close time may exceed 1440. `7:00 AM – 1:00 AM` is `{ open: 420, close:
  1500 }`; `7:00 AM – 12:00 AM` is `{ open: 420, close: 1440 }`. **Midnight
  means the end of the day, never 00:00 of the same morning** — the off-by-a-day
  bug this model exists to prevent.
- "Now" is resolved into `Africa/Mogadishu` via `Intl`. The visitor's device
  timezone is never read, so the badge is right whether they are in Mogadishu
  or Los Angeles.
- One shared 60-second ticker drives every badge on the page
  (`src/lib/use-live-now.ts` via `useSyncExternalStore`) — twenty store cards
  do not create twenty timers, and the timer is torn down with the last card.

40 tests cover the hours and deep-link logic, including overnight spill-over
(both the 1:00 AM and 12:30 AM closes), the late Friday openings, a café with
no schedule at all, and a sweep of UTC offsets from −7 to +14.
`npm run test:tz` re-runs the whole suite under `TZ=UTC`, `America/New_York`,
`Asia/Tokyo`, `Pacific/Kiritimati` and `Africa/Mogadishu` and must produce
identical results.

---

## Accessibility

- **Contrast:** all 29 foreground/background pairs in the palette meet WCAG AA.
  The tightest is "Closing soon" on the deep bone surface at 4.53:1. The focus
  ring follows the band — crimson on bone (6.35:1), amber on espresso (8.55:1)
  — because no single colour cleared 3:1 against both.
- **Structure:** exactly one `<h1>` per page, no skipped heading levels, alt
  text on every image, a title on the map iframe, an accessible name on every
  icon-only link.
- **Keyboard:** skip link, visible focus everywhere, Base UI drives the menu
  tabs (roving tabindex, arrow keys) and the mobile drawer (focus trap, escape,
  scroll lock). The locations rail is a labelled, focusable scroll region.
- **Touch:** every interactive target is at least 44px tall.
- **Motion:** `prefers-reduced-motion` disables the steam, shimmer, parallax
  and masked reveals globally and per-component; only opacity fades remain.
- **No JavaScript:** reveals ship their hidden `initial` state in the SSR HTML,
  so a `<noscript>` rule restores every `[data-reveal]` element to its resting
  state. The page reads fine with the bundle blocked.

---

## Implementation notes

- **No carousel library.** The locations rail is CSS scroll-snap with native
  touch scrolling; the arrows are a pointer convenience.
- **Menu deep-links.** `?menu=cold-brews` is server-rendered so a shared link
  opens on the right tab, then switching is instant via
  `history.replaceState` — no navigation, no refetch.
- **Steam vs shimmer.** Hot drinks get drifting CSS steam; cold drinks and
  bakes get a slow specular sweep, because steam on an iced latte is a lie.
- **Directions.** The universal Google Maps URL is rendered on the server and
  during first paint; iOS/iPadOS swaps to the Apple Maps scheme once the user
  agent is known, which keeps the markup hydration-safe. The country is only
  appended when the address does not already name its territory, and a city is
  dropped when the address repeats it — compared on a normalised key, because
  Somali place names transliterate inconsistently ("Garoowe" / "Garowe").
- The `AGENTS.md` block is written and re-added by `next dev`; it is committed
  deliberately so the tree stays clean.
