"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type HeroBackgroundVideo = {
  srcMp4?: string;
  srcWebm?: string;
  srcOgv?: string;
  poster?: string;
  preload?: React.VideoHTMLAttributes<HTMLVideoElement>["preload"];
  className?: string;
};

export interface HeroBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  video?: false | HeroBackgroundVideo;
}

const DEFAULT_VIDEO: HeroBackgroundVideo = {
  srcWebm: "/videos/bg-hero/bg-Hero_home.webm",
  srcMp4: "/videos/bg-hero/bg-Hero_home.mp4",
  srcOgv: "/videos/bg-hero/bg-Hero_home.ogv",
  preload: "metadata",
};

export function HeroBackground({
  className,
  video,
  ...props
}: HeroBackgroundProps): React.JSX.Element {
  const v = video === false ? null : { ...DEFAULT_VIDEO, ...(video ?? {}) };

  return (
    <div
      aria-hidden
      {...props}
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      {v ? (
        <video
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            "opacity-[0.16] dark:opacity-[0.12]",
            "motion-reduce:hidden",
            v.className
          )}
          autoPlay
          muted
          loop
          playsInline
          poster={v.poster}
          preload={v.preload}
        >
          {v.srcWebm ? <source src={v.srcWebm} type="video/webm" /> : null}
          {v.srcMp4 ? <source src={v.srcMp4} type="video/mp4" /> : null}
          {v.srcOgv ? <source src={v.srcOgv} type="video/ogg" /> : null}
        </video>
      ) : null}

      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-10",
          "bg-gradient-to-b from-background/0 via-background/0 to-background/10",
          "dark:to-background/30"
        )}
      />
    </div>
  );
}
