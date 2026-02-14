"use client";

import * as React from "react";
import Lenis from "lenis";
import { animate, set, stagger } from "animejs";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeEffects(): React.JSX.Element | null {
  React.useLayoutEffect(() => {
    const reduced = prefersReducedMotion();

    // Smooth scrolling (disable in reduced motion).
    const lenis = reduced
      ? null
      : new Lenis({
          duration: 1.05,
          smoothWheel: true,
          syncTouch: true,
        });

    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = window.requestAnimationFrame(loop);
    };

    if (lenis) raf = window.requestAnimationFrame(loop);

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const a = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;

      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash) as HTMLElement | null;
      if (!el) return;

      event.preventDefault();

      if (reduced) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      lenis?.scrollTo(el, { offset: -64 });
    };

    document.addEventListener("click", onAnchorClick, true);

    // CTA micro-interactions.
    const onPointerEnter = (event: Event) => {
      if (reduced) return;
      const target = event.target as Element | null;
      const el = target?.closest?.("[data-cta-anim]") as HTMLElement | null;
      if (!el) return;
      animate(el, { scale: 1.02, duration: 220, easing: "easeOutCubic" });
    };

    const onPointerLeave = (event: Event) => {
      if (reduced) return;
      const target = event.target as Element | null;
      const el = target?.closest?.("[data-cta-anim]") as HTMLElement | null;
      if (!el) return;
      animate(el, { scale: 1, duration: 260, easing: "easeOutCubic" });
    };

    document.addEventListener("pointerenter", onPointerEnter, true);
    document.addEventListener("pointerleave", onPointerLeave, true);

    // Reveal-on-view animations.
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const allItems: HTMLElement[] = [];

    for (const el of revealTargets) {
      const items = el.hasAttribute("data-reveal-children")
        ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"))
        : [el];
      allItems.push(...items);
    }

    if (!reduced) {
      set(allItems, { opacity: 0, translateY: 22, scale: 0.99 });
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.dataset.revealed === "true") continue;
          el.dataset.revealed = "true";

          const items = el.hasAttribute("data-reveal-children")
            ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"))
            : [el];

          if (items.length === 0) continue;

          if (reduced) {
            continue;
          }

          animate(items, {
            opacity: [0, 1],
            translateY: [22, 0],
            scale: [0.99, 1],
            easing: "easeOutCubic",
            duration: 750,
            delay: stagger(90),
          });
        }
      },
      { threshold: 0.18 }
    );

    for (const el of revealTargets) io.observe(el);

    return () => {
      document.removeEventListener("click", onAnchorClick, true);
      document.removeEventListener("pointerenter", onPointerEnter, true);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      io.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
