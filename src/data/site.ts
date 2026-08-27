/**
 * Site-wide content.
 *
 * Every string in this file that is marked `source: "site"` is reproduced
 * verbatim from the live beydancoffee.com screenshots. Strings marked
 * `source: "drafted"` were written for this rebuild in Beydan’s voice because
 * the live site truncated or omitted them — they are NOT sourced copy and
 * should be reviewed before launch. See README "Content provenance".
 */

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/franchise", label: "Franchise" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
] as const;

/** The same links in the shape the primary nav component consumes. */
export const NAV_ITEMS = NAV_LINKS.map((link) => ({
  title: link.label,
  href: link.href,
}));

export const CONTACT = {
  email: "info@beydancoffee.com",
  headquarters: "Mogadishu, Somalia",
  copyright: "© 2026 Beydan Coffee. All Rights Reserved.",
} as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/beydancoffee", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/beydancoffee", icon: "facebook" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/beydancoffee", icon: "linkedin" },
  { label: "YouTube", href: "https://www.youtube.com/@beydancoffee", icon: "youtube" },
] as const;

/**
 * [NEEDS CONTENT: real app store listing URLs]
 * The live site shows App Store and Google Play badges, but the screenshots do
 * not expose their href targets. These render as disabled until supplied.
 */
export const APP_LINKS = {
  appStore: null as string | null,
  googlePlay: null as string | null,
} as const;

/** Home hero — verbatim from the live site. */
export const HERO = {
  eyebrow: "AFRICAS MODERN COFFEEHOUSE",
  headline: ["Crafted with Passion.", "Served with Purpose."],
  body: "Beydan Coffee blends artisanal roasting, fresh baking, and warm hospitality to create a café experience rooted in community.",
} as const;

/** "Our Story" — verbatim, three paragraphs. */
export const STORY_PARAGRAPHS = [
  "Beydan Coffee is a modern Pan-African coffee company redefining café culture across the continent. Proudly recognized as Somalia’s leading coffee brand, Beydan embodies a new generation of African hospitality. Rooted in craftsmanship, community, and a passion for quality.",
  "Founded in February 2018 as a small home-based bakery in Mogadishu, Beydan began by handcrafting premium desserts for local homes, hotels, and offices. Guided by a deep love for coffee and connection, the brand evolved into a full-fledged coffeehouse experience, blending artisanal coffee, freshly baked goods, and authentic service that reflect Africa’s warmth and creativity.",
  "With a bold vision to expand across Africa, Beydan is building a continental network of flagship cafés that celebrate African coffee origins, local ingredients, and world-class design. The brand stands as a testament to how Africa’s own talent, flavours, and hospitality can inspire a new global standard in the coffee industry.",
] as const;

/**
 * The "by the numbers" row. Every figure is stated on the live site:
 * 11 stores, three cities, founded February 2018.
 */
export const FACTS = [
  { value: "11", label: "Stores trading", note: "Across the network" },
  { value: "03", label: "Cities", note: "Hargeisa · Garoowe · Mogadishu" },
  { value: "2018", label: "Founded", note: "February, Mogadishu" },
] as const;

/**
 * The carousel sitting under the "by the numbers" stack. These are general
 * café and brand shots rather than illustrations of any one figure, so they
 * are listed separately from FACTS. `name` is the basename looked for in
 * `public/images/`; `shot` is what the placeholder and the screen-reader
 * announcement both read out until a real file lands.
 */
export const NUMBERS_GALLERY = [
  {
    name: "numbers-guest-cup",
    shot: "A guest with a Beydan cup",
    // She holds the cup high, so a centred crop clips both the lid and the top
    // of her hijab while wasting the frame on her shoulder. Anchoring near the
    // top keeps the whole cup and her whole face.
    focus: "center 15%",
  },
  { name: "numbers-welcome", shot: "Guests greeted over coffee" },
  // No `focus` needed: the cup sits dead centre, so the default crop holds it.
  { name: "numbers-matcha-henna", shot: "A matcha latte, held" },
  {
    name: "numbers-named-cup",
    shot: "A cup written out by hand",
    // Near-square source in a very wide frame: centring keeps the face but
    // slices off the written cup, which is the point of the photograph.
    focus: "center 62%",
  },
  { name: "numbers-matcha-table", shot: "Matcha, iced coffee and a croissant" },
  { name: "numbers-desk-cup", shot: "A named cup at a working table" },
] as const;

/** Menu page hero — verbatim. */
export const MENU_HERO = {
  eyebrow: "BEYDAN MENU",
  headline: ["Sip, savor,", "and stay awhile."],
  body: "Discover handcrafted coffee, refreshing drinks, and fresh-from-the-oven bites made daily.",
} as const;

/** Locations page intro — verbatim. */
export const LOCATIONS_INTRO =
  "Beydan Coffee operates 11 stores across three major cities. Visit a café near you or reach out to plan your next gathering with us.";

/** Franchise page — hero verbatim. */
export const FRANCHISE_HERO = {
  eyebrow: "BEYDAN FRANCHISING",
  headline: ["Bring Beydan Coffee", "to your city."],
  body: "Beydan Coffee is expanding across Africa with partners who believe in world-class hospitality, quality, and community. Join our network and bring modern café culture to your market.",
} as const;

export const FRANCHISE_SECTION = {
  eyebrow: "WHY PARTNER WITH BEYDAN",
  headline: "A centrally operated café system built for scale.",
} as const;

/**
 * The four franchise pillars.
 *
 * `sourced` holds the copy that is legible in the screenshots, verbatim.
 * `drafted` completes the sentence in Beydan’s voice — the live site’s cards
 * are cut off mid-paragraph, so the remainder is NOT sourced copy.
 */
export const FRANCHISE_PILLARS = [
  {
    title: "Modern Brand",
    sourced:
      "A Pan-African brand identity rooted in Somali heritage, designed and evolved by",
    drafted:
      " our own studio — from the cup in a guest’s hand to the room they sit in.",
  },
  {
    title: "Central Operations",
    sourced:
      "All Beydan locations are fully operated and managed by our internal teams. From staffing",
    drafted:
      " and training to daily service standards, partners inherit a system that already runs.",
  },
  {
    title: "Integrated Supply",
    sourced:
      "Coffee roasting, bakery production, equipment sourcing, ingredients, and packaging are",
    drafted:
      " handled in-house, so every café opens with one supply chain behind it.",
  },
  {
    title: "Brand & Growth",
    sourced:
      "Beydan leads all brand, marketing, and launch initiatives across its locations. From",
    drafted:
      " opening day onward, your café is marketed by the team that built the brand.",
  },
] as const;

/** Careers page — verbatim. */
export const CAREERS_HERO = {
  eyebrow: "JOIN BEYDAN",
  headline: ["Careers at", "Beydan Coffee"],
  body: "We’re more than a coffee brand—we’re a community of bakers, roasters, leaders, and baristas who believe every guest deserves exceptional hospitality.",
} as const;

export const CAREERS_CULTURE = {
  eyebrow: "OUR CULTURE",
  headline: "Craftsmanship, passion, and purpose.",
  columns: [
    "We take pride in the details because they define who we are. Every roast, every cup, and every pastry reflects our dedication to doing things with intention. Our culture encourages growth, teamwork, and excellence, ensuring each guest feels the care behind our craft.",
    "We believe great coffee starts with great people. Our teams are collaborative, diverse, and dedicated to creating exceptional experiences for every guest. Whether behind the espresso machine, in our bakery, accounting office, or at our roasting centre, each role plays a part in our story of growth and quality.",
  ],
} as const;

/** Contact page — verbatim. */
export const CONTACT_COPY = {
  headline: "Contact Us",
  body: "We’d love to hear from you! Whether you’re curious about our latest coffee roast, planning an event, or just have a question, we’re here to help. Send us an email or find us on social media to get in touch.",
  careersPrompt: "Looking for a job? Visit our Careers page",
} as const;
