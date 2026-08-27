"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * A silent, looping video used as imagery rather than as a player.
 *
 * There are no controls and no audio track, so it is exposed to assistive
 * technology as an image with a description rather than as media the visitor
 * is expected to operate.
 *
 * Playback is started from an effect rather than the `autoplay` attribute so
 * that `prefers-reduced-motion` can be honoured properly: paired with
 * `preload="none"`, a visitor who asked for less motion sees the poster and
 * never downloads the video at all.
 */
export function AmbientVideo({
  sources,
  poster,
  label,
  className,
  videoClassName,
}: {
  /** In preference order — the browser takes the first type it supports. */
  sources: readonly { src: string; type: string }[];
  poster: string;
  /** Describes what the footage shows, for assistive technology. */
  label: string;
  className?: string;
  videoClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (query.matches) {
        video.pause();
        return;
      }
      // preload="none" means nothing has been fetched yet; play() starts it.
      // The promise rejects if the browser blocks autoplay, which is fine —
      // the poster stays up and nothing is broken.
      void video.play().catch(() => {});
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-timber", className)}>
      <video
        ref={videoRef}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        // Not a player: no controls, no sound, purely decorative motion.
        role="img"
        aria-label={label}
        className={cn("size-full object-cover", videoClassName)}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  );
}
