"use client";

import * as React from "react";
import { useTranslation } from "@/components/providers/i18n-provider";
import { SectionCtaFooter } from "@/components/blocks/section-cta-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Send,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Check,
  TrendingUp,
  Euro,
  Calendar,
} from "lucide-react";

export default function ContactoPage() {
  const { t } = useTranslation();

  // Simplified form data for display purposes
  const formData = {
    name: "",
    email: "",
    phone: "",
    clinic: "",
    message: "",
  };

  const isSubmitting = false; // Always false for static display
  const hasSubmittedBefore = false; // Always false for static display

  const roiData = {
    monthlyRevenue: 1340,
    yearlyRevenue: 16080,
    roi: 35,
    timestamp: new Date().getTime(),
  };

  return (
    <div className="w-full">
      <section
        className="how-surface-hero home-reflections ambient-section pb-16 text-foreground md:pb-24 lg:pb-32"
      >
        <div className="page-hero-content mx-auto w-full max-w-screen-2xl px-4">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 dark:from-primary dark:via-gradient-purple dark:to-gradient-to flex items-center justify-center shadow-lg dark:glow-primary">
                <Send className="w-8 h-8 text-white dark:text-black" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-foreground/80 dark:text-foreground/90 sm:text-2xl max-w-3xl mx-auto">
              {t("contact.description")}
            </p>
          </div>
        </div>
      </section>

      <section
        className="how-surface-steps home-reflections ambient-section py-16 text-foreground md:py-24 lg:py-32"
      >
        <div className="container relative z-10 mx-auto max-w-screen-xl px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch">
        {/* First Box: ROI Summary + Demo Status */}
        <div className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm p-8 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20 h-full flex flex-col">
          {/* ROI Summary Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 dark:from-primary dark:via-gradient-purple dark:to-gradient-to flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white dark:text-black" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("contact.form.roiSummary.title")}
              </h2>
            </div>

            <>
              <div className="grid gap-4 sm:grid-cols-3">
          {/* Monthly Revenue */}
          <div className="p-4 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base text-muted-foreground">
                {t("contact.form.roiSummary.monthlyRevenue")}
              </span>
              <Euro className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">
              {`${roiData.monthlyRevenue.toLocaleString()}€`}
            </p>
          </div>

          {/* Yearly Revenue */}
          <div className="p-4 rounded-lg border border-border bg-muted/50">
            <p className="text-base text-muted-foreground mb-1">
              {t("contact.form.roiSummary.yearlyRevenue")}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {`${roiData.yearlyRevenue.toLocaleString()}€`}
            </p>
          </div>

          {/* ROI */}
          <div className="p-4 rounded-lg border border-border bg-muted/50">
            <p className="text-base text-muted-foreground mb-1">
              {t("contact.form.roiSummary.roi")}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {roiData.roi > 0 ? '+' : ''}{roiData.roi}%
            </p>
          </div>
        </div>
              <div className="mt-4">
                <p className="text-base text-muted-foreground">
                  {t("contact.form.roiSummary.calculated")}: {new Date(roiData.timestamp).toLocaleString()}
                </p>
              </div>
            </>

            {/* Data Acceptance Notice */}
            <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 dark:bg-green-500/20 p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-base font-medium text-green-700 dark:text-green-300">
                  {t("contact.form.dataAcceptance")}
                </p>
              </div>
            </div>
          </div>

          {/* Demo Status Section */}
          <div className="pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 dark:from-primary dark:via-gradient-purple dark:to-gradient-to flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white dark:text-black" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("contact.form.demoStatus.label")}
              </h2>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 transition-all hover:border-primary hover:shadow-2xl dark:hover:shadow-primary/20 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  {t("contact.form.title")}
                </h2>

                <form className="space-y-6" autoComplete="off">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                      {t("contact.form.fields.name.label")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={formData.name}
                        placeholder={t("contact.form.fields.name.placeholder")}
                        className="pl-10"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      {t("contact.form.fields.email.label")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={formData.email}
                        placeholder={t("contact.form.fields.email.placeholder")}
                        className="pl-10"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">
                      {t("contact.form.fields.phone.label")}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={formData.phone}
                        placeholder={t("contact.form.fields.phone.placeholder")}
                        className="pl-10"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinic" className="text-base font-medium">
                      {t("contact.form.fields.clinic.label")}
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="clinic"
                        name="clinic"
                        type="text"
                        defaultValue={formData.clinic}
                        placeholder={t("contact.form.fields.clinic.placeholder")}
                        className="pl-10"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-medium">
                      {t("contact.form.fields.message.label")}
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Textarea
                        id="message"
                        name="message"
                        defaultValue={formData.message}
                        autoComplete="off"
                        placeholder={t("contact.form.fields.message.placeholder")}
                        className="pl-10 min-h-[180px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {t("contact.form.submit")}
                    </Button>
                  </div>
                </form>
              </div>
        </div>
        </div>
      </section>
    </div>
  );
}
