/**
 * Placeholder artwork as an SVG data URI.
 *
 * Most of the site draws missing photography with <MediaFrame>, which renders
 * real markup. Third-party components that take an image *URL* cannot use it,
 * so this produces the same visual language — warm espresso wash, the rake
 * motif, an "image needed" marker and the file name to supply — as something
 * an <img src> can point at.
 *
 * It is deliberately not a stock photo: nothing here should ever be mistaken
 * for real Beydan photography.
 */

const WIDTH = 900;
const HEIGHT = 1200;

/** Wrap a caption to a couple of short lines so it survives a narrow crop. */
function wrap(text: string, perLine = 9, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > perLine && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface PlaceholderImageOptions {
  /** The file name to drop into public/images, shown on the artwork. */
  name: string;
  /**
   * A very short caption. Keep it terse: a collapsed accordion panel reveals
   * only a narrow strip through the middle of the artwork, and anything long
   * gets clipped mid-word.
   */
  caption: string;
}

export function placeholderImage({
  name,
  caption: captionText,
}: PlaceholderImageOptions): string {
  const lines = wrap(captionText);
  const centre = HEIGHT / 2;

  // Everything sits in the middle third horizontally: a collapsed accordion
  // panel only reveals the centre of the image, and the marker has to stay
  // legible there.
  const caption = lines
    .map(
      (line, index) =>
        `<text x="${WIDTH / 2}" y="${centre - 10 + index * 31}" fill="#d6cabb" font-family="system-ui,sans-serif" font-size="21" font-weight="500" text-anchor="middle">${escapeXml(line)}</text>`,
    )
    .join("");

  // The whole block is lifted well above the panel's lower edge: the gallery
  // component draws its own label there, and the two must not collide.
  const markerY = centre - 10 + lines.length * 31 + 26;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img">
<defs>
<radialGradient id="wash" cx="25%" cy="0%" r="120%">
<stop offset="0%" stop-color="#c87c33"/>
<stop offset="58%" stop-color="#332a20"/>
<stop offset="100%" stop-color="#1a1512"/>
</radialGradient>
<pattern id="rake" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="skewX(-20)">
<rect width="6" height="44" fill="#ab2733" opacity="0.5"/>
<rect x="18" width="6" height="44" fill="#e9a05a" opacity="0.5"/>
</pattern>
</defs>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)"/>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#rake)" opacity="0.05"/>
<g stroke="#c3b5a4" stroke-width="4" fill="none" opacity="0.55" stroke-linecap="round">
<rect x="${WIDTH / 2 - 26}" y="${centre - 140}" width="52" height="44" rx="6"/>
<circle cx="${WIDTH / 2 - 10}" cy="${centre - 124}" r="6"/>
<path d="M${WIDTH / 2 - 24} ${centre - 104} l18 -16 l14 12"/>
<path d="M${WIDTH / 2 - 34} ${centre - 148} l68 60"/>
</g>
${caption}
<text x="${WIDTH / 2}" y="${markerY}" fill="#a89a8b" font-family="system-ui,sans-serif" font-size="16" font-weight="600" letter-spacing="1" text-anchor="middle">IMAGE</text>
<text x="${WIDTH / 2}" y="${markerY + 21}" fill="#a89a8b" font-family="system-ui,sans-serif" font-size="16" font-weight="600" letter-spacing="1" text-anchor="middle">NEEDED</text>
<rect x="${WIDTH / 2 - 108}" y="${markerY + 40}" width="216" height="38" rx="19" fill="none" stroke="#5a4d40" stroke-width="2"/>
<text x="${WIDTH / 2}" y="${markerY + 65}" fill="#c3b5a4" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="16" text-anchor="middle">${escapeXml(name)}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ""))}`;
}
