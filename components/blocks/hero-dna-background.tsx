"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroDnaBackground({ className }: { className?: string }): React.JSX.Element {
  const hostRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = prefersReducedMotion();
    let instance: { remove: () => void; resizeCanvas: (w: number, h: number, noRedraw?: boolean) => void } | null = null;
    let cancelled = false;

    // Dynamic import: p5 touches window at module eval time.
    const load = async () => {
      const mod = await import("p5");
      const P5 = (mod as unknown as { default?: unknown }).default ?? mod;
      if (cancelled) return;

      const sketch = (p: any) => {
        let w = 0;
        let h = 0;
        let t = 0;

      const resize = () => {
        w = host.clientWidth;
        h = host.clientHeight;
        p.resizeCanvas(w, h, false);
      };

      p.setup = () => {
        w = host.clientWidth;
        h = host.clientHeight;
        p.createCanvas(w, h).parent(host);
        p.pixelDensity(1);
        p.frameRate(24);
        p.noFill();
        p.strokeCap(p.ROUND);

        if (reduced) p.noLoop();
      };

      p.draw = () => {
        p.clear(0, 0, 0, 0);
        t += 0.012;

        const cx = w * 0.5;
        const amp = Math.min(180, w * 0.18);
        const stepY = Math.max(10, Math.floor(h / 90));

        for (let y = -40; y <= h + 40; y += stepY) {
          const yn = y / h;
          const phase = t + yn * 7.2;
          const sway = Math.sin(phase) * amp;
          const x1 = cx + sway;
          const x2 = cx - sway;
          const link = 0.10 + 0.20 * (0.5 + 0.5 * Math.sin(phase * 1.6));

          const a = 18 + 55 * (1 - Math.abs(yn - 0.55));
          const weight = 0.7 + 1.2 * link;

          // Soft connectors.
          p.stroke(80, 210, 255, a * 0.25);
          p.strokeWeight(weight);
          p.line(x1, y, x2, y);

          // Strand points (two tones for depth).
          p.noStroke();
          p.fill(50, 240, 210, a);
          p.circle(x1, y, 4.4 + 2.0 * link);
          p.fill(120, 120, 255, a * 0.9);
          p.circle(x2, y, 4.4 + 2.0 * (1 - link));
        }

        // Subtle bloom rings.
        p.noFill();
        p.stroke(80, 210, 255, 12);
        p.strokeWeight(1);
        p.circle(cx, h * 0.55, Math.min(w, h) * 0.62);
        p.stroke(120, 120, 255, 9);
        p.circle(cx, h * 0.55, Math.min(w, h) * 0.78);
      };

      p.windowResized = () => {
        resize();
      };
    };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance = new (P5 as any)(sketch);
    };

    void load();

    const ro = new ResizeObserver(() => {
      try {
        instance?.resizeCanvas(host.clientWidth, host.clientHeight, false);
      } catch {
        // Ignore.
      }
    });
    ro.observe(host);

    return () => {
      cancelled = true;
      ro.disconnect();
      try {
        instance?.remove();
      } catch {
        // Ignore.
      }
      instance = null;
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        // Force absolute positioning even inside `.home-reflections > *`.
        "pointer-events-none !absolute inset-0 overflow-hidden z-0",
        className
      )}
    >
      <div
        ref={hostRef}
        className={
          "absolute inset-0 origin-center scale-110 transform-gpu opacity-70 blur-2xl " +
          "saturate-150 mix-blend-multiply dark:mix-blend-screen"
        }
      />
    </div>
  );
}
