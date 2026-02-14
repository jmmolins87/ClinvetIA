"use client";

import * as React from "react";
import Link from "next/link";

import { RoiButton } from "@/components/cta/roi-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const FOOTER_LINKS = {
  product: [
    { href: "/solucion", label: "Solucion" },
    { href: "/escenarios", label: "Casos de uso" },
    { href: "/roi", label: "Calculadora ROI" },
    { href: "/como-funciona", label: "Como funciona" },
  ],
  company: [
    { href: "/faqs", label: "FAQs" },
    { href: "/contacto", label: "Contacto" },
  ],
} as const;

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border/40 bg-background", className)}>
      <div className="container mx-auto max-w-screen-2xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-block cursor-pointer rounded-md outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              aria-label="Ir arriba"
            >
              <Logo className="h-14" />
            </button>
            <p className="text-sm text-muted-foreground">
              Automatizacion inteligente con IA para clinicas veterinarias.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Producto</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Empresa</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Empieza hoy</h3>
            <p className="text-sm text-muted-foreground">
              Calcula el impacto o reserva una demo.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <RoiButton asChild>
                <Link href="/roi">
                  <span className="flex items-center gap-2">
                    <Icon name="Calculator" className="h-4 w-4" />
                    ROI
                  </span>
                </Link>
              </RoiButton>
              <Button variant="secondary" size="lg" className="h-12" asChild>
                <Link href="/reservar">
                  <span className="flex items-center gap-2">
                    <Icon name="Calendar" className="h-4 w-4" />
                    Reservar demo
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} Clinvetia. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacidad"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terminos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
