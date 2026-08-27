import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

/**
 * Type pairing: a characterful editorial serif set very large for display,
 * against a restrained grotesk for body and UI. Fraunces' WONK and SOFT axes
 * give the headlines their slightly wonky, hand-cut warmth; Archivo keeps the
 * interface quiet underneath it.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beydancoffee.com"),
  title: {
    default: "Beydan Coffee — Africa’s modern coffeehouse",
    template: "%s · Beydan Coffee",
  },
  description:
    "Beydan Coffee blends artisanal roasting, fresh baking, and warm hospitality to create a café experience rooted in community. 11 stores across Hargeisa, Garoowe and Mogadishu.",
  openGraph: {
    type: "website",
    siteName: "Beydan Coffee",
    locale: "en",
    title: "Beydan Coffee — Africa’s modern coffeehouse",
    description:
      "Crafted with passion. Served with purpose. Find a Beydan café near you.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#16120f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        {/* Scroll reveals ship their `initial` state in the SSR HTML, so
            without JavaScript the page would render mostly blank. This puts
            every animated element back to its resting state. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
