"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { ExpandableNav } from "@/components/expandable-nav";
import { LogoLink } from "@/components/logo";
import { Rake } from "@/components/rake";
import { Cta } from "@/components/cta";
import {
  Dialog,
  DialogClose,
  DialogDrawerContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NAV_ITEMS, NAV_LINKS } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Sticky header that condenses on scroll: it shrinks, gains an espresso
 * backdrop with blur, and drops a hairline. Every page opens on a dark band,
 * so the header keeps cream type throughout and never has to swap palettes
 * mid-scroll.
 */
export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Navigation is client-side, so the sheet is dismissed by the links
  // themselves rather than by watching the pathname from an effect.
  const closeDrawer = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setCondensed(window.scrollY > 24);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-band="dark"
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-cream",
        "transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out",
        condensed
          ? "bg-espresso/90 shadow-[0_1px_0_0_var(--beydan-timber-line),0_18px_40px_-28px_rgba(0,0,0,0.9)] supports-backdrop-filter:backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-crimson px-5 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center"
      >
        Skip to content
      </a>

      <div
        className={cn(
          "shell flex items-center justify-between gap-6",
          "transition-[padding] duration-300 ease-out",
          condensed ? "py-3" : "py-5",
        )}
      >
        <LogoLink
          onDark
          width={118}
          className={cn(
            "origin-left transition-transform duration-300 ease-out",
            condensed ? "scale-90" : "scale-100",
          )}
        />

        <ExpandableNav items={NAV_ITEMS} className="hidden lg:flex" />

        <div className="hidden lg:block">
          <Cta href="/locations" arrow="right" className="text-cream">
            Order at a café
          </Cta>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className="inline-flex size-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </DialogTrigger>

          <DialogDrawerContent>
            <div className="flex items-center justify-between">
              <DialogTitle className="sr-only">Site menu</DialogTitle>
              <LogoLink onDark width={112} />
              <DialogClose
                className="inline-flex size-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" />
              </DialogClose>
            </div>

            <nav aria-label="Primary (mobile)" className="mt-4">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);
                  return (
                    <li key={link.href} className="border-b border-timber-line">
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={closeDrawer}
                        className={cn(
                          "display-4 flex min-h-14 items-center justify-between py-3 transition-colors",
                          active ? "text-crimson" : "text-cream hover:text-crimson",
                        )}
                      >
                        {link.label}
                        <Rake
                          className={cn(
                            "h-3 w-auto transition-opacity",
                            active ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Delegated: a click on the CTA inside also dismisses the sheet. */}
            <div className="mt-auto pt-6" onClick={closeDrawer}>
              <Cta href="/locations" arrow="right" className="text-cream">
                Order at a café
              </Cta>
            </div>
          </DialogDrawerContent>
        </Dialog>
      </div>
    </header>
  );
}
