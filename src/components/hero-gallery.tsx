"use client";

import AccordionGallery from "@/components/AccordionGallery/AccordionGallery";

/**
 * Beydan wiring for the React Bits AccordionGallery.
 *
 * The vendor component is used exactly as shipped — this file only supplies
 * props. It carries the "use client" boundary because the vendor file has no
 * directive of its own and must not be edited; marking the wrapper pulls the
 * whole subtree client-side, which is all it needs.
 *
 * Theme props mirror the design tokens rather than the component's
 * white-on-near-black defaults: crimson accent bar, espresso overlay, cream
 * label text.
 */

export interface HeroPanel {
  /** Real photograph when one exists, otherwise placeholder artwork. */
  image: string;
  alt: string;
  label: string;
}

export function HeroGallery({ panels }: { panels: HeroPanel[] }) {
  return (
    <AccordionGallery
      items={panels}
      // Middle of five, so the hero loads with an expanded focal panel.
      defaultIndex={2}
      accentColor="#ab2733"
      overlayColor="#16120f"
      textColor="#f7efe6"
      height={520}
      gap={12}
      radius={20}
      orientation="horizontal"
      trigger="hover"
    />
  );
}
