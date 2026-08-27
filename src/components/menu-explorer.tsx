"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { ProductCard, type MenuItemView } from "@/components/product-card";
import { RailScrollbar } from "@/components/rail-scrollbar";
import { Tabs } from "@/components/ui/tabs";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { MenuCategory } from "@/data/menu";
import { cn } from "@/lib/utils";

export interface MenuCategoryView extends Omit<MenuCategory, "items"> {
  items: MenuItemView[];
}

const QUERY_KEY = "menu";

/**
 * The interactive menu.
 *
 * - Category pills carry a live count of the items actually published.
 * - The active pill is tracked by a shared `layoutId`, so the crimson fill
 *   slides between pills instead of popping.
 * - Switching category crossfades and slides the panel while the wrapper
 *   animates its own height, so nothing below the menu jumps.
 * - The category is mirrored into `?menu=<slug>` with `history.replaceState`,
 *   which makes a category linkable without triggering a navigation.
 */
export function MenuExplorer({
  categories,
  initialCategory,
}: {
  categories: MenuCategoryView[];
  initialCategory: string;
}) {
  const [active, setActive] = useState(initialCategory);
  const railRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  // Keep the tab in step with back/forward navigation.
  useEffect(() => {
    const onPopState = () => {
      const slug = new URLSearchParams(window.location.search).get(QUERY_KEY);
      if (slug && categories.some((category) => category.slug === slug)) {
        setActive(slug);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [categories]);

  const select = useCallback((slug: string) => {
    setActive(slug);
    const url = new URL(window.location.href);
    url.searchParams.set(QUERY_KEY, slug);
    // replaceState keeps the switch instant: no route change, no refetch.
    window.history.replaceState(null, "", url);
  }, []);

  const current =
    categories.find((category) => category.slug === active) ?? categories[0];

  return (
    <Tabs
      value={active}
      onValueChange={(value) => select(String(value))}
      className="gap-10"
    >
      {/*
        The tabs get their own tinted strip with a divider under it, so the row
        reads as a control bar sitting above the content rather than floating
        on the same flat cream as the grid. It bleeds to the shell edges; the
        rail inside keeps the padding so pills can scroll edge to edge.
      */}
      <div className="-mx-[clamp(1.25rem,4.5vw,4.5rem)] border-b border-current/12 bg-current/[0.035] pt-4 pb-3.5">
        {/*
          Ten pills do not fit a static row at any realistic width, so the rail
          scrolls and snaps rather than wrapping. The mask softens both edges
          so it reads as continuing past them.
        */}
        <TabsPrimitive.List
          ref={railRef}
          className={cn(
            "rail rail-hide-bar gap-2.5 px-[clamp(1.25rem,4.5vw,4.5rem)]",
            "[mask-image:linear-gradient(to_right,transparent_0,black_clamp(1.25rem,4.5vw,4.5rem),black_calc(100%-clamp(1.25rem,4.5vw,4.5rem)),transparent_100%)]",
          )}
          aria-label="Menu categories"
        >
        {categories.map((category) => {
          const selected = category.slug === active;
          return (
            <TabsPrimitive.Tab
              key={category.slug}
              value={category.slug}
              className={cn(
                "relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2.5 rounded-full border px-5",
                "text-[0.875rem] font-semibold whitespace-nowrap transition-colors duration-200",
                selected
                  ? "border-transparent text-white"
                  : "border-current/20 text-muted-foreground hover:border-current/45 hover:text-foreground",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="menu-tab-fill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-crimson"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 38 }
                  }
                />
              ) : null}

              <span className="relative">{category.name}</span>

              <span
                className={cn(
                  "relative inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5",
                  "text-[0.6875rem] font-semibold tabular-nums",
                  selected ? "bg-white/20 text-white" : "bg-current/10",
                )}
              >
                {category.items.length}
                <span className="sr-only">
                  {" "}
                  item{category.items.length === 1 ? "" : "s"}
                </span>
              </span>
            </TabsPrimitive.Tab>
          );
        })}
        </TabsPrimitive.List>

        <RailScrollbar
          targetRef={railRef}
          className="mt-3.5 mx-[clamp(1.25rem,4.5vw,4.5rem)]"
        />
      </div>

      {/* `layout` lets the wrapper animate its own height between categories. */}
      <motion.div layout={!reduced} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, x: reduced ? 0 : 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -18 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <TabsPrimitive.Panel value={current.slug} keepMounted>
              <CategoryPanel category={current} />
            </TabsPrimitive.Panel>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Tabs>
  );
}

function CategoryPanel({ category }: { category: MenuCategoryView }) {
  return (
    <div>
      <p className="body-lg max-w-xl text-muted-foreground">{category.blurb}</p>

      <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] gap-5">
        {category.items.map((item) => (
          <li key={item.slug} className="h-full">
            <ProductCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
