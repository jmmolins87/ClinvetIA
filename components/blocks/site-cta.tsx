import Link from "next/link";

import { DemoButton } from "@/components/cta/demo-button";
import { RoiButton } from "@/components/cta/roi-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SiteCtaProps {
  className?: string;
  title?: string;
  description?: string;

  demoLabel?: string;
  demoHref?: string;
  roiLabel?: string;
  roiHref?: string;

  contactLabel?: string;
  contactHref?: string;
}

export function SiteCta({
  className,
  title = "Listo para verlo en tu clinica?",
  description = "Reserva una demo o calcula el impacto en tu ROI.",
  demoLabel = "Reservar demo",
  demoHref = "/reservar",
  roiLabel = "ROI",
  roiHref = "/roi",

  contactLabel = "Contacto",
  contactHref = "/contacto",
}: SiteCtaProps) {
  return (
    <section
      aria-label="Llamada a la accion"
      className={cn(
        "rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-7 md:p-8 text-center",
        className
      )}
    >
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <RoiButton asChild className="w-full sm:w-auto">
          <Link href={roiHref}>{roiLabel}</Link>
        </RoiButton>
        <DemoButton asChild className="w-full sm:w-auto">
          <Link href={demoHref}>{demoLabel}</Link>
        </DemoButton>
      </div>

      <div className="mt-3 flex justify-center">
        <Button variant="ghost" size="lg" asChild className="h-12 w-full sm:w-auto">
          <Link href={contactHref}>{contactLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
