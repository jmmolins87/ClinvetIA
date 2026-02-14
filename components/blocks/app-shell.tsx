"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/blocks/site-footer";
import { SiteHeader } from "@/components/blocks/site-header";

export function AppShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="w-full flex-1">{children}</main>
      {isHome ? null : <SiteFooter />}
    </div>
  );
}
