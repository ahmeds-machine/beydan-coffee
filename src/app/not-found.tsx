import { Band, Eyebrow } from "@/components/band";
import { Cta, CtaRow } from "@/components/cta";

export default function NotFound() {
  return (
    <Band tone="dark" className="grid min-h-[70vh] place-items-center pt-36 pb-24">
      <div className="shell">
        <Eyebrow className="text-amber">404</Eyebrow>
        <h1 className="display-1 mt-6 max-w-[14ch] text-cream">
          That page isn&rsquo;t on the menu.
        </h1>
        <p className="body-lg mt-6 max-w-md text-cream-soft">
          The link may be old. Try the café directory, or start again from the
          beginning.
        </p>
        <CtaRow className="mt-9">
          <Cta href="/locations" arrow="right">
            Find a café
          </Cta>
          <Cta href="/" variant="ghost">
            Back to home
          </Cta>
        </CtaRow>
      </div>
    </Band>
  );
}
