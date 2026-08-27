import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import logoAsset from "../../public/brand/logo-from-screenshot.png";

/**
 * The BEYDAN wordmark.
 *
 * The mark is NOT redrawn in code. This renders the real wordmark, extracted
 * pixel-for-pixel from the live site’s own header and matted onto transparency.
 * Because the source was a screenshot it is only 132px wide, so it is capped at
 * its native size to stay sharp.
 *
 * Replace `public/brand/logo-from-screenshot.png` with the official vector
 * (`logo.svg`) when it is available and update the import below — nothing else
 * needs to change. See README "Logo".
 */
export function Logo({
  className,
  onDark = false,
  width = 124,
}: {
  className?: string;
  /** Lifts the mark slightly so the crimson holds up on espresso. */
  onDark?: boolean;
  width?: number;
}) {
  return (
    <Image
      src={logoAsset}
      alt="Beydan Coffee"
      width={width}
      height={Math.round((width / logoAsset.width) * logoAsset.height)}
      priority
      className={cn(
        "h-auto w-auto select-none",
        onDark && "brightness-115 contrast-105",
        className,
      )}
      style={{ width, height: "auto" }}
    />
  );
}

export function LogoLink({
  className,
  onDark = false,
  width,
}: {
  className?: string;
  onDark?: boolean;
  width?: number;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-11 items-center rounded-sm transition-opacity hover:opacity-80",
        className,
      )}
      aria-label="Beydan Coffee — home"
    >
      <Logo onDark={onDark} width={width} />
    </Link>
  );
}
