import "@testing-library/jest-dom/vitest";

import * as React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
    addListener: () => undefined,
    removeListener: () => undefined,
  }),
});

window.scrollTo = () => undefined;

vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      React.createElement("a", { href, ...props }, children),
  };
});

vi.mock("next/image", () => {
  return {
    // eslint-disable-next-line @next/next/no-img-element
    default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
      const { priority, ...rest } = props;
      return React.createElement("img", rest);
    },
  };
});

vi.mock("next/navigation", () => {
  return {
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
  };
});
