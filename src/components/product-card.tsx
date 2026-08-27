import { MediaFrame } from "@/components/media-frame";
import { Shimmer, Steam } from "@/components/steam";
import type { MenuItem } from "@/data/menu";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface MenuItemView extends MenuItem {
  media: Media;
}

/**
 * A product card: a tall image above a footer carrying the item name and
 * nothing else, matching how items are presented on Beydan's own menu.
 *
 * There is deliberately no description, price or dietary badge — no such data
 * is published, and an empty slot reads worse than no slot at all. Hot drinks
 * get drifting steam; cold drinks and bakes get a slow specular sweep instead,
 * because steam on an iced latte is a lie. Both loops stop entirely under
 * prefers-reduced-motion, leaving the hover fade.
 */
export function ProductCard({
  item,
  className,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 80vw",
  priority = false,
}: {
  item: MenuItemView;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        "group/product flex h-full flex-col overflow-hidden rounded-2xl border border-current/10 bg-card",
        "transition-[border-color,transform,box-shadow] duration-300",
        "hover:-translate-y-1 hover:border-crimson/45 hover:shadow-[0_30px_60px_-45px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {/* Landscape, not portrait: with only a name underneath, a tall image
          left the card lopsided and the name an afterthought. */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <MediaFrame
          media={item.media}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0"
          imageClassName="transition-transform duration-300 ease-out motion-safe:group-hover/product:scale-105"
        />
        {item.hot ? <Steam /> : <Shimmer />}
      </div>

      <div className="px-5 py-6">
        <h3 className="display-4">{item.name}</h3>
      </div>
    </article>
  );
}
