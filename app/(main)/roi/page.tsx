"use client";

import * as React from "react";
import { useTranslation } from "@/components/providers/i18n-provider";
import { AppShell } from "@/components/blocks/app-shell";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Euro,
  Clock,
  Calculator,
  Info,
  Building2,
  Store,
  Building,
  Home,
} from "lucide-react";

type ClinicType = "small" | "medium" | "large" | "specialized";

const CLINIC_TYPES: { id: ClinicType; icon: typeof Building2; color: string }[] = [
  { id: "small", icon: Home, color: "from-pink-500 via-fuchsia-600 to-pink-600 dark:from-green-500 dark:via-pink-500 dark:to-fuchsia-500" },
  { id: "medium", icon: Store, color: "from-green-500 via-emerald-600 to-green-600 dark:from-green-500 dark:via-emerald-500 dark:to-green-500" },
  { id: "large", icon: Building, color: "from-purple-500 via-pink-600 to-purple-600 dark:from-purple-500 dark:via-pink-500 dark:to-purple-500" },
  { id: "specialized", icon: Building2, color: "from-orange-500 via-amber-600 to-orange-600 dark:from-orange-500 dark:via-amber-500 dark:to-orange-500" },
];

export default function ROIPage() {
  const { t } = useTranslation();
  
  const [clinicType, setClinicType] = React.useState<ClinicType | null>(null);
  const [monthlyPatients, setMonthlyPatients] = React.useState(0);
  const [avgTicket, setAvgTicket] = React.useState(0);
  const [missedRate, setMissedRate] = React.useState(0);
  
  const getClinicConfig = (type: ClinicType) => {
    switch (type) {
      case "small":
        return {
          recoveryRate: 0.65,
          systemCost: 179,
          defaultPatients: 120,
          defaultTicket: 55,
          defaultMissedRate: 35
        }
      case "medium":
        return {
          recoveryRate: 0.70,
          systemCost: 199,
          defaultPatients: 250,
          defaultTicket: 65,
          defaultMissedRate: 30
        }
      case "large":
        return {
          recoveryRate: 0.75,
          systemCost: 249,
          defaultPatients: 450,
          defaultTicket: 75,
          defaultMissedRate: 25
        }
      case "specialized":
        return {
          recoveryRate: 0.60,
          systemCost: 229,
          defaultPatients: 180,
          defaultTicket: 95,
          defaultMissedRate: 30
        }
    }
  }
  
  const emptyConfig = {
    recoveryRate: 0,
    systemCost: 0,
    defaultPatients: 0,
    defaultTicket: 0,
    defaultMissedRate: 0,
  }

  const config = clinicType ? getClinicConfig(clinicType) : emptyConfig;
  
  const missedPatients = Math.round((monthlyPatients * missedRate) / 100);
  const recoveredPatients = Math.round(missedPatients * config.recoveryRate);
  const monthlyRevenue = recoveredPatients * avgTicket;
  const yearlyRevenue = monthlyRevenue * 12;
  const roi = config.systemCost > 0 ? Math.round(((monthlyRevenue - config.systemCost) / config.systemCost) * 100) : 0;
  const breakEvenDays = config.systemCost > 0 && monthlyRevenue > 0 ? Math.round((config.systemCost / (monthlyRevenue / 30))) : 0;
  
  const handleClinicTypeChange = (type: ClinicType) => {
    setClinicType(type);
    const config = getClinicConfig(type);
    setMonthlyPatients(config.defaultPatients);
    setAvgTicket(config.defaultTicket);
    setMissedRate(config.defaultMissedRate);
  };

  return (
    <AppShell>
      <section className="roi-surface-hero ambient-section home-reflections pt-32 pb-16 md:pt-40 md:py-16">
        <div className="container relative z-10 mx-auto max-w-screen-xl px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 dark:from-primary dark:via-gradient-purple dark:to-gradient-to flex items-center justify-center shadow-lg dark:glow-primary">
                  <Calculator className="w-8 h-8 text-white dark:text-black" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {t("roi.calculator.title")}
              </h1>
              <p className="text-xl text-muted-foreground sm:text-2xl max-w-3xl mx-auto">
                {t("roi.calculator.description")}
              </p>
            </div>
        </div>
      </section>

      <section className="roi-surface-info ambient-section home-reflections py-12 md:py-16">
        <div className="container relative z-10 mx-auto max-w-screen-xl px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm p-6 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20">
                  <h2 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {t("roi.calculator.whatIsROI.title")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("roi.calculator.whatIsROI.description")}
                  </p>
                </div>

                <div className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm p-6 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20">
                  <h2 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    {t("roi.calculator.whatIsCalculator.title")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("roi.calculator.whatIsCalculator.description")}
                  </p>
                </div>
              </div>
            </div>
        </div>
      </section>

      <section className="roi-surface-calculator ambient-section home-reflections py-12 md:py-16">
        <div id="roi-calculator" className="container relative z-10 mx-auto max-w-screen-xl px-4 scroll-mt-24">
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto items-stretch">
            {/* Inputs */}
            <div
              className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20 h-full flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                {t("roi.calculator.inputs.title")}
              </h2>
              
              <div className="space-y-6 flex-1">
                {/* Clinic Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    {t("roi.calculator.inputs.clinicType.label")}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {CLINIC_TYPES.map((clinic) => {
                      const Icon = clinic.icon
                      const isSelected = clinicType === clinic.id
                      return (
                        <button
                          key={clinic.id}
                          onClick={() => handleClinicTypeChange(clinic.id)}
                          className={`relative rounded-lg border p-4 transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 dark:bg-primary/20"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2 text-center">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${clinic.color} flex items-center justify-center ${isSelected ? "dark:glow-sm" : ""}`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {t(`roi.calculator.inputs.presets.${clinic.id}`)}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("roi.calculator.inputs.clinicType.help")}
                  </p>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-patients" className="text-sm font-medium">
                      {t("roi.calculator.inputs.monthlyPatients.label")}
                    </Label>
                    <Input
                      id="monthly-patients"
                      type="number"
                      value={monthlyPatients}
                      onChange={(e) => setMonthlyPatients(Number(e.target.value))}
                      className="text-lg"
                      min="0"
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("roi.calculator.inputs.monthlyPatients.help")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avg-ticket" className="text-sm font-medium">
                      {t("roi.calculator.inputs.avgTicket.label")}
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="avg-ticket"
                        type="number"
                        value={avgTicket}
                        onChange={(e) => setAvgTicket(Number(e.target.value))}
                        className="text-lg pl-10"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("roi.calculator.inputs.avgTicket.help")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="missed-rate" className="text-sm font-medium">
                      {t("roi.calculator.inputs.missedRate.label")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="missed-rate"
                        type="number"
                        value={missedRate}
                        onChange={(e) => setMissedRate(Number(e.target.value))}
                        className="text-lg"
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("roi.calculator.inputs.missedRate.help")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setClinicType(null);
                    setMonthlyPatients(0);
                    setAvgTicket(0);
                    setMissedRate(0);
                  }}
                  className="cursor-pointer"
                >
                  {t("roi.calculator.inputs.presets.clear")}
                </Button>
              </div>
            </div>
            
            <div className="space-y-6 h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-primary" />
                {t("roi.calculator.results.title")}
              </h2>

              <div className="space-y-6 flex-1">
                <div className="rounded-xl border border-primary bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 p-6 backdrop-blur-sm transition-all hover:shadow-2xl dark:hover:shadow-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      {t("roi.calculator.results.monthlyRevenue")}
                    </p>
                    <Euro className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-4xl font-bold text-primary mb-1">
                    {`${monthlyRevenue.toLocaleString()}€`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("roi.calculator.results.yearlyRevenue")}: {`${yearlyRevenue.toLocaleString()}€`}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      {t("roi.calculator.results.roi")}
                    </p>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-4xl font-bold text-foreground mb-1">
                    {roi > 0 ? '+' : ''}{roi}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("roi.calculator.results.roiHelp")}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      {t("roi.calculator.results.breakEven")}
                    </p>
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-4xl font-bold text-foreground mb-1">
                    {breakEvenDays} {t("roi.calculator.results.days")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("roi.calculator.results.breakEvenHelp")}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    {t("roi.calculator.results.breakdown")}
                  </h3>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("roi.calculator.results.missedPatients")}</span>
                      <span className="font-medium text-foreground">{missedPatients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("roi.calculator.results.recoveredPatients")}</span>
                      <span className="font-medium text-primary">{recoveredPatients}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-muted-foreground">{t("roi.calculator.results.recoveryRate")}</span>
                      <span className="font-medium text-foreground">{`${Math.round(config.recoveryRate * 100)}%`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block max-w-4xl mx-auto mt-6">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-foreground/70 text-center">
                <Info className="w-4 h-4 inline mr-2 text-gradient-to dark:text-primary" />
                {t("roi.calculator.disclaimer")}
              </p>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
    </AppShell>
  );
}

