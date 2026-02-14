"use client";

import Link from "next/link";

import { HomeEffects } from "@/app/home-effects";
import { HeroDnaBackground } from "@/components/blocks/hero-dna-background";
import { SiteCta } from "@/components/blocks/site-cta";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Logo } from "@/components/logo";
import { useTranslation } from "@/components/providers/i18n-provider";
import { Icon, type IconName } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { ScrollDownButton } from "@/components/ui/scroll-down-button";
import {
  NeonCard,
  NeonCardDescription,
  NeonCardHeader,
  NeonCardTitle,
} from "@/components/ui/neon-card";
import { Stepper } from "@/components/ui/stepper";

export default function Home() {
  const { t } = useTranslation();

  const problemCards = [
    {
      icon: "MessageCircle",
      titleKey: "home.problem.cards.late.title",
      textKey: "home.problem.cards.late.text",
    },
    {
      icon: "Users",
      titleKey: "home.problem.cards.overload.title",
      textKey: "home.problem.cards.overload.text",
    },
    {
      icon: "CircleAlert",
      titleKey: "home.problem.cards.missed.title",
      textKey: "home.problem.cards.missed.text",
    },
    {
      icon: "Calendar",
      titleKey: "home.problem.cards.manual.title",
      textKey: "home.problem.cards.manual.text",
    },
  ] satisfies Array<{ icon: IconName; titleKey: string; textKey: string }>;

  const featureCards = [
    {
      icon: "Brain",
      titleKey: "home.features.cards.understand.title",
      textKey: "home.features.cards.understand.text",
    },
    {
      icon: "Clock",
      titleKey: "home.features.cards.availability.title",
      textKey: "home.features.cards.availability.text",
    },
    {
      icon: "CalendarCheck",
      titleKey: "home.features.cards.booking.title",
      textKey: "home.features.cards.booking.text",
    },
    {
      icon: "BellRing",
      titleKey: "home.features.cards.followup.title",
      textKey: "home.features.cards.followup.text",
    },
  ] satisfies Array<{ icon: IconName; titleKey: string; textKey: string }>;

  const benefitCards = [
    {
      icon: "Zap",
      titleKey: "home.benefits.cards.urgent.title",
      textKey: "home.benefits.cards.urgent.text",
    },
    {
      icon: "TrendingUp",
      titleKey: "home.benefits.cards.lessCalls.title",
      textKey: "home.benefits.cards.lessCalls.text",
    },
    {
      icon: "Heart",
      titleKey: "home.benefits.cards.calm.title",
      textKey: "home.benefits.cards.calm.text",
    },
    {
      icon: "Target",
      titleKey: "home.benefits.cards.reminders.title",
      textKey: "home.benefits.cards.reminders.text",
    },
  ] satisfies Array<{ icon: IconName; titleKey: string; textKey: string }>;

  const scenarioCards = [
    {
      icon: "CircleAlert",
      titleKey: "home.scenarios.cards.emergency.title",
      textKey: "home.scenarios.cards.emergency.text",
    },
    {
      icon: "Syringe",
      titleKey: "home.scenarios.cards.preventive.title",
      textKey: "home.scenarios.cards.preventive.text",
    },
    {
      icon: "Activity",
      titleKey: "home.scenarios.cards.chronic.title",
      textKey: "home.scenarios.cards.chronic.text",
    },
    {
      icon: "Scissors",
      titleKey: "home.scenarios.cards.multi.title",
      textKey: "home.scenarios.cards.multi.text",
    },
  ] satisfies Array<{ icon: IconName; titleKey: string; textKey: string }>;

  const roiStats = [
    {
      key: "response",
      valueKey: "home.kpi.stats.response.value",
      labelKey: "home.kpi.stats.response.label",
    },
    {
      key: "lost",
      valueKey: "home.kpi.stats.lost.value",
      labelKey: "home.kpi.stats.lost.label",
    },
    {
      key: "growth",
      valueKey: "home.kpi.stats.growth.value",
      labelKey: "home.kpi.stats.growth.label",
    },
  ] as const;

  return (
    <div className="w-full">
      <HomeEffects />

      <section
        id="hero"
        className="home-reflections relative w-full min-h-dvh overflow-hidden bg-background text-foreground"
        aria-label="Hero"
      >
        <HeroDnaBackground />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        />

        <div
          className="mx-auto w-full max-w-screen-2xl px-4 pt-12 pb-20 md:pt-16 md:pb-28 min-h-dvh flex flex-col justify-center"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto w-full max-w-5xl text-center">
            <div className="flex justify-center" data-reveal-item>
              <Logo
                width={960}
                height={240}
                className="h-16 w-auto sm:h-20 md:h-28 lg:h-32"
                priority
              />
            </div>

            <h1
              className="hero-title mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              data-reveal-item
            >
              {t("home.hero.title")}
            </h1>
            <p
              className="hero-subtitle mx-auto mt-5 max-w-3xl text-lg font-medium text-foreground/85 sm:text-xl md:text-2xl"
              data-reveal-item
            >
              {t("home.hero.subtitle")}
            </p>

            <div
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              data-reveal-item
            >
              <Button
                variant="secondary"
                size="lg"
                className="h-12 w-full sm:w-auto"
                asChild
              >
                <Link href="/reservar" data-cta-anim>{t("home.hero.ctaPrimary")}</Link>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="h-12 w-full sm:w-auto dark:glow-primary"
                asChild
              >
                <Link href="/roi" data-cta-anim>{t("home.hero.ctaSecondary")}</Link>
              </Button>
            </div>

            <div className="mt-8" data-reveal-item>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>{t("common.discoverMore")}</span>
              </div>
              <div className="mt-3 flex justify-center">
                <ScrollDownButton
                  aria-label={t("common.discoverMore")}
                  targetId="problem-section"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="problem-section"
        className="home-reflections home-surface-problem home-shadow-problem scroll-mt-20 min-h-dvh flex items-center"
        aria-label={t("home.problem.eyebrow")}
      >
        <div
          className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto max-w-4xl text-center" data-reveal-item>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.problem.eyebrow")}
            </h2>
            <p className="mt-3 text-xl font-semibold text-destructive sm:text-2xl">
              {t("home.problem.headline")}
            </p>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">{t("home.problem.lead")}</p>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6"
            data-reveal-item
          >
            {problemCards.map((item) => (
              <NeonCard key={item.titleKey} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="flex-row items-start gap-4">
                  <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-orange-500 text-white shadow-sm">
                    <Icon name={item.icon} size={22} aria-label={t(item.titleKey)} />
                  </div>
                  <div className="min-w-0">
                    <NeonCardTitle className="text-xl leading-tight">{t(item.titleKey)}</NeonCardTitle>
                    <NeonCardDescription className="mt-1 text-sm">{t(item.textKey)}</NeonCardDescription>
                  </div>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section
        id="system-section"
        className="home-reflections home-surface-system home-shadow-system scroll-mt-20 min-h-dvh flex items-center"
        aria-label={t("home.features.title")}
      >
        <div
          className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto max-w-4xl text-center" data-reveal-item>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.features.title")}
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">{t("home.features.lead")}</p>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6"
            data-reveal-item
          >
            {featureCards.map((item) => (
              <NeonCard key={item.titleKey} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="items-center text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                    <Icon name={item.icon} size={22} aria-label={t(item.titleKey)} />
                  </div>
                  <NeonCardTitle className="mt-4 text-lg">{t(item.titleKey)}</NeonCardTitle>
                  <NeonCardDescription className="mt-2">{t(item.textKey)}</NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-4xl" data-reveal-item>
            <NeonCard className="relative bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
              <NeonCardHeader className="text-center">
                <div className="mx-auto -mt-10 w-fit rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm dark:glow-primary">
                  {t("home.features.stat")}
                </div>
                <NeonCardDescription className="mt-4 text-base text-foreground/80">
                  {t("home.features.statNote")}
                </NeonCardDescription>
              </NeonCardHeader>
            </NeonCard>
          </div>
        </div>
      </section>

      <section
        id="flow-section"
        className="home-reflections home-surface-flow home-shadow-flow scroll-mt-20 min-h-dvh flex items-center"
        aria-label={t("home.flow.title")}
      >
        <div
          className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto max-w-4xl text-center" data-reveal-item>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.flow.title")}
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">{t("home.flow.lead")}</p>
          </div>

          <div className="mx-auto mt-10 max-w-6xl" data-reveal-item>
            <Stepper
              variant="cards"
              steps={[
                {
                  key: "1",
                  icon: "MessageCircle",
                  title: t("home.flow.steps.1.title"),
                  description: t("home.flow.steps.1.text"),
                },
                {
                  key: "2",
                  icon: "Brain",
                  title: t("home.flow.steps.2.title"),
                  description: t("home.flow.steps.2.text"),
                },
                {
                  key: "3",
                  icon: "CalendarCheck",
                  title: t("home.flow.steps.3.title"),
                  description: t("home.flow.steps.3.text"),
                },
                {
                  key: "4",
                  icon: "BellRing",
                  title: t("home.flow.steps.4.title"),
                  description: t("home.flow.steps.4.text"),
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section
        id="benefits-section"
        className="home-reflections home-surface-benefits home-shadow-benefits scroll-mt-20 min-h-dvh flex items-center"
        aria-label={t("home.benefits.title")}
      >
        <div
          className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto max-w-4xl text-center" data-reveal-item>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.benefits.title")}
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">{t("home.benefits.lead")}</p>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6"
            data-reveal-item
          >
            {benefitCards.map((item) => (
              <NeonCard key={item.titleKey} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="flex-row items-start gap-4">
                  <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                    <Icon name={item.icon} size={22} aria-label={t(item.titleKey)} />
                  </div>
                  <div className="min-w-0">
                    <NeonCardTitle className="text-xl leading-tight text-gradient-to dark:text-primary">
                      {t(item.titleKey)}
                    </NeonCardTitle>
                    <NeonCardDescription className="mt-1 text-sm">{t(item.textKey)}</NeonCardDescription>
                  </div>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section
        id="scenarios-section"
        className="home-reflections home-surface-scenarios home-shadow-scenarios scroll-mt-20 min-h-dvh flex items-center"
        aria-label={t("home.scenarios.title")}
      >
        <div
          className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto max-w-4xl text-center" data-reveal-item>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.scenarios.title")}
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">{t("home.scenarios.lead")}</p>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6"
            data-reveal-item
          >
            {scenarioCards.map((item) => (
              <NeonCard key={item.titleKey} className="bg-background/55 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="items-center text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                    <Icon name={item.icon} size={22} aria-label={t(item.titleKey)} />
                  </div>
                  <NeonCardTitle className="mt-4 text-lg">{t(item.titleKey)}</NeonCardTitle>
                  <NeonCardDescription className="mt-2">{t(item.textKey)}</NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>

          <div className="mt-10 text-center" data-reveal-item>
            <Button variant="secondary" size="lg" className="h-12" asChild>
              <Link href="/escenarios" data-cta-anim>{t("home.scenarios.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="roi-section"
        className="home-reflections home-surface-roi home-shadow-roi scroll-mt-20 min-h-dvh flex items-center"
        aria-label={t("home.kpi.title")}
      >
        <div
          className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20"
          data-reveal
          data-reveal-children
        >
          <div className="mx-auto max-w-4xl text-center" data-reveal-item>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.kpi.title")}
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">{t("home.kpi.lead")}</p>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3 md:gap-6"
            data-reveal-item
          >
            {roiStats.map((stat) => (
              <NeonCard key={stat.key} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="items-center text-center">
                  <div className="text-4xl font-bold text-gradient-to dark:text-primary">
                    {t(stat.valueKey)}
                  </div>
                  <NeonCardDescription className="mt-2 text-sm">{t(stat.labelKey)}</NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6" data-reveal-item>
            <NeonCard className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
              <NeonCardHeader className="flex-row items-start gap-4">
                <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground">
                  <Icon name="Euro" size={22} aria-label={t("home.kpi.impact.money.title")} />
                </div>
                <div className="min-w-0">
                  <NeonCardTitle className="text-xl">{t("home.kpi.impact.money.title")}</NeonCardTitle>
                  <NeonCardDescription className="mt-1 text-sm">{t("home.kpi.impact.money.text")}</NeonCardDescription>
                </div>
              </NeonCardHeader>
            </NeonCard>

            <NeonCard className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
              <NeonCardHeader className="flex-row items-start gap-4">
                <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground">
                  <Icon name="Clock" size={22} aria-label={t("home.kpi.impact.time.title")} />
                </div>
                <div className="min-w-0">
                  <NeonCardTitle className="text-xl">{t("home.kpi.impact.time.title")}</NeonCardTitle>
                  <NeonCardDescription className="mt-1 text-sm">{t("home.kpi.impact.time.text")}</NeonCardDescription>
                </div>
              </NeonCardHeader>
            </NeonCard>
          </div>

          <div className="mt-10 text-center" data-reveal-item>
            <Button variant="default" size="lg" className="h-12 dark:glow-primary" asChild>
              <Link href="/roi" data-cta-anim>{t("home.kpi.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="final-cta-section"
        className="home-reflections home-surface-final home-shadow-final scroll-mt-20 min-h-dvh flex flex-col"
        aria-label={t("home.final.title")}
      >
        <div className="flex-1 flex items-center">
          <div
            className="mx-auto w-full max-w-screen-2xl px-4 py-12 md:py-16"
            data-reveal
            data-reveal-children
          >
            <div className="max-w-3xl mx-auto" data-reveal-item>
              <SiteCta
                title={t("home.final.title")}
                description={t("home.final.lead")}
                demoLabel={t("home.final.ctaPrimary")}
                demoHref="/reservar"
                roiLabel={t("home.final.ctaSecondary")}
                roiHref="/roi"
              />
            </div>
          </div>
        </div>

        <SiteFooter density="compact" className="bg-transparent" />
      </section>
    </div>
  );
}
