/**
 * Photography resolution.
 *
 * No image assets were supplied with the rebuild brief, so this module looks
 * for a real file in `public/images/` and, when it finds nothing, hands the UI
 * a null `src`. Components then render a clearly-labelled placeholder instead
 * of a fabricated stock photo.
 *
 * Drop `public/images/<name>.jpg` (or .png/.webp/.avif) into place and it is
 * picked up on the next build — no code change needed.
 *
 * Server-only: it reads the filesystem. Pages resolve media and pass the plain
 * result object down to client components as props.
 */

import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = [".avif", ".webp", ".jpg", ".jpeg", ".png"] as const;
const IMAGE_DIR = path.join(process.cwd(), "public", "images");

let cache: Map<string, string> | null = null;

function index(): Map<string, string> {
  if (cache) return cache;
  const found = new Map<string, string>();
  try {
    for (const file of fs.readdirSync(IMAGE_DIR)) {
      const ext = path.extname(file).toLowerCase();
      if (!EXTENSIONS.includes(ext as (typeof EXTENSIONS)[number])) continue;
      const base = path.basename(file, path.extname(file));
      // First match by EXTENSIONS order wins, so avif/webp beat jpg.
      const existing = found.get(base);
      if (
        !existing ||
        EXTENSIONS.indexOf(ext as (typeof EXTENSIONS)[number]) <
          EXTENSIONS.indexOf(
            path.extname(existing).toLowerCase() as (typeof EXTENSIONS)[number],
          )
      ) {
        found.set(base, `/images/${file}`);
      }
    }
  } catch {
    // No images directory yet: every lookup resolves to a placeholder.
  }
  cache = found;
  return found;
}

export interface Media {
  /** Public path to a real file, or null when none has been supplied. */
  src: string | null;
  alt: string;
  /** What the slot is for — shown inside the placeholder. */
  subject: string;
  name: string;
}

/**
 * @param name    file basename to look for in public/images
 * @param alt     alt text used when a real image is present
 * @param subject human description shown in the placeholder when it is not
 */
export function resolveMedia(name: string, alt: string, subject: string): Media {
  return { src: index().get(name) ?? null, alt, subject, name };
}
