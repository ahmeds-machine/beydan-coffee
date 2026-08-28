/**
 * Menu — the full published line-up, 10 categories and 68 items.
 *
 * Item names are transcribed from Beydan's own menu, including its spellings
 * ("Safron Rose Latte"). Nothing here is invented.
 *
 * KNOWN GAPS — see README:
 *  - [NEEDS CONTENT: photography] Every drink has been photographed. The 22
 *    food items — Cakes, Desserts, and Salads & Sandwiches — have not, and
 *    those cards still render the placeholder. Drop
 *    `public/images/product-<slug>` into place and it is picked up on the
 *    next build.
 *  - [NEEDS CONTENT: prices] No prices are published, and the cards are
 *    name-only by design, so none is shown — not even a placeholder.
 *  - [NEEDS CONTENT: dietary data] Vegan / dairy-free / gluten-free data is
 *    being supplied separately. The badge slot has deliberately been removed
 *    from the card rather than left empty; re-add it when the data lands.
 */

export interface MenuItem {
  slug: string;
  name: string;
  /** Served hot — drives the steam animation; cold items shimmer instead. */
  hot: boolean;
  /** True when the item is one of the homepage's "Signature Offerings". */
  signature?: boolean;
}

export interface MenuCategory {
  slug: string;
  name: string;
  /** One line, shown above the item grid. */
  blurb: string;
  items: readonly MenuItem[];
}

export const MENU: readonly MenuCategory[] = [
  {
    slug: "coffee",
    name: "Coffee",
    blurb: "Espresso pulled to order, poured short and warm.",
    items: [
      { slug: "espresso-macchiato", name: "Espresso Macchiato", hot: true },
      { slug: "cortado", name: "Cortado", hot: true, signature: true },
      { slug: "cappuccino", name: "Cappuccino", hot: true },
      { slug: "cafe-latte", name: "Cafe Latte", hot: true },
      { slug: "americano", name: "Americano", hot: true },
      { slug: "caramel-cappuccino", name: "Caramel Cappuccino", hot: true },
      { slug: "caramel-latte", name: "Caramel Latte", hot: true },
    ],
  },
  {
    slug: "frappe",
    name: "Frappé",
    blurb: "Blended thick and cold, finished with cream.",
    items: [
      { slug: "caramel-coffee-frappe", name: "Caramel Coffee Frappe", hot: false },
      { slug: "coffee-frappe", name: "Coffee Frappe", hot: false },
      { slug: "lotus-frappe", name: "Lotus Frappe", hot: false },
      { slug: "strawberry-cream-frappe", name: "Strawberry & Cream Frappe", hot: false },
      { slug: "white-cookie-frappe", name: "White Cookie Frappe", hot: false },
      { slug: "white-chocolate-frappe", name: "White Chocolate Frappe", hot: false },
      { slug: "yellow-mellow-frappe", name: "Yellow Mellow Frappe", hot: false },
      { slug: "pink-candy-frappe", name: "Pink Candy Frappe", hot: false },
      { slug: "vanilla-frappe", name: "Vanilla Frappe", hot: false },
    ],
  },
  {
    slug: "ice",
    name: "Ice",
    blurb: "The bar's espresso and tea line-up, served long over ice.",
    items: [
      { slug: "iced-americano", name: "Iced Americano", hot: false },
      { slug: "iced-latte", name: "Iced Latte", hot: false },
      { slug: "iced-spanish-latte", name: "Iced Spanish Latte", hot: false },
      { slug: "iced-chai-latte", name: "Iced Chai Latte", hot: false },
      { slug: "iced-caramel-latte", name: "Iced Caramel Latte", hot: false },
      { slug: "iced-mocha", name: "Iced Mocha", hot: false },
      {
        slug: "iced-white-chocolate-mocha",
        name: "Iced White Chocolate Mocha",
        hot: false,
      },
    ],
  },
  {
    slug: "matcha",
    name: "Matcha",
    blurb: "Whisked to order, hot or over ice.",
    items: [
      { slug: "hot-matcha", name: "Hot Matcha", hot: true },
      { slug: "matcha-frappe", name: "Matcha Frappe", hot: false },
      {
        slug: "iced-matcha-latte",
        name: "Iced Matcha Latte",
        hot: false,
        signature: true,
      },
      { slug: "mango-matcha-latte", name: "Mango Matcha Latte", hot: false },
      { slug: "strawberry-matcha-latte", name: "Strawberry Matcha Latte", hot: false },
    ],
  },
  {
    slug: "refreshers",
    name: "Refreshers",
    blurb: "Fruit and iced tea, built cold and served tall.",
    items: [
      {
        slug: "cherry-lemonade-refresher",
        name: "Cherry Lemonade Refresher",
        hot: false,
      },
      {
        slug: "passion-lemonade-refresher",
        name: "Passion Lemonade Refresher",
        hot: false,
      },
      { slug: "peach-iced-tea", name: "Peach Iced Tea", hot: false },
      { slug: "raspberry-iced-tea", name: "Raspberry Iced Tea", hot: false },
    ],
  },
  {
    slug: "smoothies",
    name: "Smoothies",
    blurb: "Fruit blended through, thick enough to stand a spoon in.",
    items: [
      { slug: "very-berry-smoothie", name: "Very Berry Smoothie", hot: false },
      { slug: "blueberry-smoothie", name: "Blueberry Smoothie", hot: false },
      { slug: "safron-rose-latte", name: "Safron Rose Latte", hot: true },
    ],
  },
  {
    slug: "tea-chocolate",
    name: "Tea & Chocolate",
    blurb: "Spiced and steeped, the way tea is taken at home.",
    items: [
      { slug: "beydani-tea", name: "Beydani Tea", hot: true },
      { slug: "karak-tea", name: "Karak Tea", hot: true },
      { slug: "chai-latte", name: "Chai Latte", hot: true },
      { slug: "somali-tea", name: "Somali Tea", hot: true },
      { slug: "spanish-tea", name: "Spanish Tea", hot: true },
      { slug: "masala-tea", name: "Masala Tea", hot: true },
      { slug: "camel-milk-tea", name: "Camel Milk Tea", hot: true },
      { slug: "hot-chocolate", name: "Hot Chocolate", hot: true },
      { slug: "qaxwo-somali", name: "Qaxwo Somali", hot: true },
    ],
  },
  {
    slug: "cakes",
    name: "Cakes",
    blurb: "Cut to order from the counter, baked in house.",
    items: [
      { slug: "carrot-cake", name: "Carrot Cake", hot: false },
      { slug: "honey-cake", name: "Honey Cake", hot: false },
      { slug: "chocolate-cake", name: "Chocolate Cake", hot: false },
      {
        slug: "lotus-tres-leches",
        name: "Lotus Tres Leches",
        hot: false,
        signature: true,
      },
      { slug: "pistachio-tres-leches", name: "Pistachio Tres Leches", hot: false },
      { slug: "red-velvet-cake", name: "Red Velvet Cake", hot: false },
      { slug: "lotus-cheese-cake", name: "Lotus Cheese Cake", hot: false },
      { slug: "tiramisu", name: "Tiramisu", hot: false },
    ],
  },
  {
    slug: "desserts",
    name: "Desserts",
    blurb: "Baked through the day, the way Beydan started in 2018.",
    items: [
      { slug: "banana-bread", name: "Banana Bread", hot: false },
      { slug: "basbousa", name: "Basbousa", hot: false },
      { slug: "brownie", name: "Brownie", hot: false },
      { slug: "carrot-muffins", name: "Carrot Muffins", hot: false },
      { slug: "croissant", name: "Croissant", hot: false },
      { slug: "almond-croissant", name: "Almond Croissant", hot: false },
      { slug: "pain-au-chocolat", name: "Pain Au Chocolat", hot: false },
      { slug: "pain-aux-raisin", name: "Pain Aux Raisin", hot: false },
      { slug: "chocolate-chip-cookies", name: "Chocolate Chip Cookies", hot: false },
      {
        slug: "double-chocolate-chip-cookie",
        name: "Double Chocolate Chip Cookie",
        hot: false,
      },
      { slug: "strawberry-pudding", name: "Strawberry Pudding", hot: false },
    ],
  },
  {
    slug: "salads-sandwiches",
    name: "Salads & Sandwiches",
    blurb: "Plates built fresh alongside the bar.",
    items: [
      { slug: "grilled-chicken-panini", name: "Grilled Chicken Panini", hot: true },
      { slug: "chicken-wrap", name: "Chicken Wrap", hot: false },
      { slug: "caprese-sandwich", name: "Caprese Sandwich", hot: false },
      { slug: "tuna-sandwich", name: "Tuna Sandwich", hot: false },
      {
        slug: "tropical-chicken-salad",
        name: "Tropical Chicken Salad",
        hot: false,
        signature: true,
      },
    ],
  },
];

/** The four items the homepage promotes, in the site's own order. */
export const SIGNATURE_ORDER = [
  "cortado",
  "iced-matcha-latte",
  "lotus-tres-leches",
  "tropical-chicken-salad",
] as const;

export const SIGNATURE_ITEMS: readonly MenuItem[] = SIGNATURE_ORDER.map(
  (slug) => {
    const item = MENU.flatMap((category) => category.items).find(
      (candidate) => candidate.slug === slug,
    );
    if (!item) throw new Error(`Signature item "${slug}" is missing from MENU`);
    return item;
  },
);
