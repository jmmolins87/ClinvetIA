"use client";

import * as React from "react";
import { useTranslation } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";

export default function ReservarPage() {
  const { t } = useTranslation();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <section className="how-surface-hero home-reflections ambient-section text-foreground pb-12 md:pb-16">
        <div className="page-hero-content container relative z-10 mx-auto max-w-screen-xl px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 dark:from-primary dark:via-gradient-purple dark:to-gradient-to flex items-center justify-center shadow-lg dark:glow-primary">
                  <Icon name="Calendar" className="w-8 h-8 text-white dark:text-black" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {t("book.title")}
              </h1>
              <p className="text-xl text-muted-foreground sm:text-2xl max-w-3xl mx-auto">
                {t("book.description")}
              </p>
            </div>
        </div>
      </section>

      <section className="how-surface-steps home-reflections ambient-section py-12 md:py-16">
        <div className="container relative z-10 mx-auto max-w-screen-xl px-4">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-10 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20">
              <Calendar
                selected={date}
                onSelect={setDate}
                className="p-0 w-full"
              />
              <div className="flex justify-end mt-8">
                <Button size="lg">
                  {t("common.bookDemo")}
                  <Icon name="Send" className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
