"use client";

import * as React from "react";
import { AppShell } from "@/components/blocks/app-shell";
import { useTranslation } from "@/components/providers/i18n-provider";
import { SectionCtaFooter } from "@/components/blocks/section-cta-footer";
import { Icon } from "@/components/ui/icon";

const SCENARIO = {
  id: "veterinary",
  icon: "Heart",
  color: "from-pink-500 via-fuchsia-600 to-pink-600 dark:from-orange-500 dark:via-amber-600 dark:to-amber-500",
} as const;

const CASES = ["midnight", "postSurgery", "chronic", "vaccines", "preventive", "multiservice", "results", "firstVisit"] as const;

export default function EscenariosPage() {
  const { t } = useTranslation();

  return (
    <AppShell>
      <section className="scenarios-surface-hero home-reflections ambient-section text-foreground">
        <div className="page-hero-content container relative z-10 mx-auto max-w-screen-xl px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${SCENARIO.color} flex items-center justify-center shadow-lg dark:glow-primary`}>
                <Icon name={SCENARIO.icon} className="w-8 h-8 text-white dark:text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t(`scenarios.${SCENARIO.id}.title`)}
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              {t(`scenarios.${SCENARIO.id}.subtitle`)}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {CASES.map((caseId) => (
                <div
                  key={caseId}
                  className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-7 transition-all hover:border-primary/40 hover:shadow-xl dark:hover:shadow-primary/15"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gradient-to dark:text-primary">
                        {t(`scenarios.veterinary.cases.items.${caseId}.badge`)}
                      </p>
                      <h4 className="text-xl md:text-2xl font-bold text-foreground">
                        {t(`scenarios.veterinary.cases.items.${caseId}.title`)}
                      </h4>
                    </div>

                    <p className="text-base text-foreground/80 dark:text-foreground/85 leading-relaxed">
                      {t(`scenarios.veterinary.cases.items.${caseId}.story`)}
                    </p>

                    <div className="rounded-xl border border-destructive/60 bg-destructive/5 p-4">
                      <p className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                        <Icon name="MessageCircleQuestionMark" />
                        {t("scenarios.veterinary.cases.ownerMessageLabel")}
                      </p>
                      <p className="text-base text-foreground leading-relaxed">
                        &quot;{t(`scenarios.veterinary.cases.items.${caseId}.ownerMessage`)}&quot;
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-green-500/60 bg-green-500/5 p-4">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-500 mb-2 flex items-center gap-2">
                          <Icon name="Lightbulb" />
                          {t("scenarios.veterinary.cases.systemDoesLabel")}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {t(`scenarios.veterinary.cases.items.${caseId}.system`)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-green-500/60 bg-green-500/5 p-4">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-500 mb-2 flex items-center gap-2">
                          <Icon name="Check" />
                          {t("scenarios.veterinary.cases.outcomeLabel")}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {t(`scenarios.veterinary.cases.items.${caseId}.outcome`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionCtaFooter
        ariaLabel={t("scenarios.cta.title")}
        title={t("scenarios.cta.title")}
        description={t("scenarios.cta.description")}
        demoLabel={t("scenarios.cta.demo")}
        demoHref="/reservar"
        roiLabel={t("scenarios.cta.roi")}
        roiHref="/roi"
      />
    </AppShell>
  );
}
