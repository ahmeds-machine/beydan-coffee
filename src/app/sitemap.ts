import type { MetadataRoute } from "next";

import { NAV_LINKS } from "@/data/site";

const BASE_URL = "https://beydancoffee.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE_URL, lastModified, priority: 1 },
    ...NAV_LINKS.map((link) => ({
      url: `${BASE_URL}${link.href}`,
      lastModified,
      priority: 0.8,
    })),
  ];
}
