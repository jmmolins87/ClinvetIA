"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/blocks/site-footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { AiAssistantDock } from "@/components/blocks/ai-assistant-dock";

export function AppShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main
        className={isHome ? "w-full flex-1 mt-[calc(-1*var(--site-header-h))]" : "w-full flex-1 flex flex-col mt-[calc(-1*var(--site-header-h))]"}
      >
        {children}
      </main>
      {isHome ? null : <SiteFooter />}
      <AiAssistantDock />
    </div>
  );
}
