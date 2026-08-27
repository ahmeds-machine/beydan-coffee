import { cn } from "@/lib/utils";

/**
 * Steam for hot drinks: three translucent wisps that drift up and sideways
 * while fading out. Pure CSS, no JavaScript, and switched off entirely under
 * prefers-reduced-motion by the global motion rule in globals.css.
 */
export function Steam({ className }: { className?: string }) {
  const wisps = [
    { left: "38%", delay: "0s", duration: "4.6s", drift: "-14px", width: "10px", peak: 0.5 },
    { left: "50%", delay: "1.1s", duration: "5.4s", drift: "12px", width: "13px", peak: 0.42 },
    { left: "62%", delay: "2.2s", duration: "5s", drift: "20px", width: "9px", peak: 0.34 },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-[46%] top-0 overflow-hidden",
        className,
      )}
    >
      {wisps.map((wisp) => (
        <span
          key={wisp.left}
          className="absolute bottom-0 block rounded-full bg-[linear-gradient(to_top,transparent,rgba(255,255,255,0.85))] blur-[6px]"
          style={
            {
              left: wisp.left,
              width: wisp.width,
              height: "62%",
              opacity: 0,
              animation: `beydan-steam ${wisp.duration} ease-out ${wisp.delay} infinite`,
              "--steam-drift": wisp.drift,
              "--steam-peak": wisp.peak,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * The cold-drink counterpart: a single slow specular sweep instead of steam,
 * so iced drinks and bakes still feel alive without implying heat.
 */
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <span
        className="absolute -inset-y-8 left-0 block w-1/3 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)]"
        style={{ animation: "beydan-shimmer 5.5s ease-in-out infinite" }}
      />
    </div>
  );
}
