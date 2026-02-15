"use client";

import Link from "next/link";

import { useTranslation } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";

export default function EscenariosPage(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <section className="ambient-section bg-background text-foreground">
        <div className="page-hero-content mx-auto w-full max-w-screen-2xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t("nav.scenarios")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Página en construcción
            </p>

            <div className="mt-8">
              <Button variant="secondary" size="lg" className="h-12" asChild>
                <Link href="/">{t("common.back")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
