/**
 * Type declarations for the React Bits AccordionGallery.
 *
 * The component ships as untyped JSX and must not be modified, so its public
 * API is declared here instead. This is additive: nothing in the runtime file
 * changes. `link` is optional — omitting it makes a panel render as a <div>
 * rather than an <a>, which is what we want for panels that have nowhere to go.
 */

export interface AccordionGalleryItem {
  image: string;
  label?: string;
  alt?: string;
  link?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
}

declare const AccordionGallery: (props: AccordionGalleryProps) => JSX.Element;

export default AccordionGallery;
