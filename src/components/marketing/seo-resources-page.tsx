"use client"

import Link from "next/link"

import { useTranslationSkeleton } from "@/components/providers/translation-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SeoCard } from "@/components/marketing/seo-card"
import { CtaSection } from "@/components/marketing/cta-section"
import { GlassCard } from "@/components/ui/GlassCard"
import { getSeoLandingConfigs } from "@/lib/seo-landings"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clinvetia.com"

export function SeoResourcesPage() {
  const { locale } = useTranslationSkeleton()
  const landingConfigs = getSeoLandingConfigs(locale)
  const operationLandings = landingConfigs.filter((item) => item.category === "operaciones")
  const marketingLandings = landingConfigs.filter((item) => item.category === "marketing")
  const featuredMarketingLandings = marketingLandings.slice(0, 3)

  const copy =
    locale === "en"
      ? {
          collectionName: "Veterinary AI resources",
          collectionDescription:
            "Clinvetia hub with pages about automation, appointments, triage, reception, chatbots, and acquisition for veterinary clinics.",
          itemListName: "Veterinary AI resources list",
          home: "Home",
          seoHub: "SEO Hub",
          heroTitle: "Veterinary AI resources for clinics that want to grow better",
          heroDescription:
            "This page groups the most relevant Clinvetia pages on AI veterinary software, automation, appointment management, triage, reception, acquisition, and follow-up.",
          recommendedPath: "Recommended path",
          pathTitle: "Start with the bottleneck that limits you the most today",
          pathDescription:
            "If your biggest issue is reception and scheduling, start with operations. If the issue is generating, replying to, or converting leads better, start with the marketing and acquisition block.",
          viewOps: "See operations and care",
          viewMarketing: "See marketing and acquisition",
          priorities: "Commercial priorities",
          operationsTitle: "Operations and care",
          operationsDescription:
            "Pages focused on reception, triage, scheduling, chatbots, and clinical follow-up.",
          marketingTitle: "Marketing and acquisition",
          marketingDescription:
            "Pages focused on leads, conversion, and commercial growth for veterinary clinics.",
          marketingIntro:
            "This block is designed for clinics that already generate demand but still lose opportunities because they reply too slowly, do not follow up, or leave marketing, messaging, and scheduling disconnected.",
          bookDemo: "Book demo",
          calculateRoi: "Calculate ROI",
          ctaTitle: "Want to apply this to your clinic's real operations?",
          ctaDescription:
            "Book a demo to review which automations, flows, and metrics make the most sense to prioritize in your case.",
          talkToTeam: "Talk to the team",
        }
      : {
          collectionName: "Recursos de IA veterinaria",
          collectionDescription:
            "Hub SEO de Clinvetia con páginas sobre automatización, citas, triaje, recepción, chatbot y captación para clínicas veterinarias.",
          itemListName: "Listado de recursos de IA veterinaria",
          home: "Inicio",
          seoHub: "Hub SEO",
          heroTitle: "Recursos de IA veterinaria para clínicas que quieren crecer mejor",
          heroDescription:
            "Aquí agrupamos las páginas más relevantes de Clinvetia sobre software veterinario con IA, automatización, gestión de citas, triaje, recepción, captación y seguimiento.",
          recommendedPath: "Ruta recomendada",
          pathTitle: "Empieza por el cuello de botella que hoy más te limita",
          pathDescription:
            "Si tu problema está en recepción y agenda, empieza por operaciones. Si el problema está en captar, responder o convertir mejor los leads que ya entran, prioriza el bloque de marketing y captación.",
          viewOps: "Ver operaciones y atención",
          viewMarketing: "Ver marketing y captación",
          priorities: "Prioridades comerciales",
          operationsTitle: "Operaciones y atención",
          operationsDescription:
            "Páginas enfocadas en recepción, triaje, agenda, chatbot y seguimiento clínico.",
          marketingTitle: "Marketing y captación",
          marketingDescription:
            "Páginas orientadas a leads, conversión y crecimiento comercial para clínicas veterinarias.",
          marketingIntro:
            "Este bloque está pensado para clínicas que ya generan demanda, pero todavía pierden oportunidades por tardar en responder, no hacer seguimiento o dejar desconectados marketing, mensajería y agenda.",
          bookDemo: "Reservar demo",
          calculateRoi: "Calcular ROI",
          ctaTitle: "¿Quieres aplicar esto a la operativa real de tu clínica?",
          ctaDescription:
            "Reserva una demo para revisar qué automatizaciones, flujos y métricas tendría sentido priorizar en tu caso.",
          talkToTeam: "Hablar con el equipo",
        }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.collectionName,
    url: `${appUrl}/recursos-ia-veterinaria`,
    description: copy.collectionDescription,
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.itemListName,
    itemListElement: landingConfigs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        name: item.metaTitle,
        url: `${appUrl}/${item.slug}`,
        description: item.metaDescription,
      },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.home, item: appUrl },
      { "@type": "ListItem", position: 2, name: copy.collectionName, item: `${appUrl}/recursos-ia-veterinaria` },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary">{copy.seoHub}</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 text-muted-foreground">{copy.heroDescription}</p>
        </div>

        <div className="grid gap-4">
          <GlassCard className="p-6 md:p-8">
            <Badge variant="secondary">{copy.recommendedPath}</Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">{copy.pathTitle}</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{copy.pathDescription}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/software-veterinario-con-ia">{copy.viewOps}</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/marketing-digital-para-veterinarios">{copy.viewMarketing}</Link>
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <Badge variant="secondary">{copy.priorities}</Badge>
            <div className="mt-4 space-y-4">
              {featuredMarketingLandings.map((item) => (
                <SeoCard
                  key={item.slug}
                  href={`/${item.slug}`}
                  title={item.metaTitle}
                  description={item.metaDescription}
                  className="min-h-0"
                />
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-10">
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight">{copy.operationsTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{copy.operationsDescription}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {operationLandings.map((item) => (
                <SeoCard
                  key={item.slug}
                  href={`/${item.slug}`}
                  title={item.metaTitle}
                  description={item.metaDescription}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight">{copy.marketingTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{copy.marketingDescription}</p>
            </div>
            <GlassCard className="mb-5 p-5">
              <p className="text-sm text-muted-foreground md:text-base">{copy.marketingIntro}</p>
            </GlassCard>
            <div
              className={
                marketingLandings.length === 1
                  ? "grid gap-4 md:max-w-2xl"
                  : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              }
            >
              {marketingLandings.map((item) => (
                <SeoCard
                  key={item.slug}
                  href={`/${item.slug}`}
                  title={item.metaTitle}
                  description={item.metaDescription}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/demo">{copy.bookDemo}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/calculadora">{copy.calculateRoi}</Link>
          </Button>
        </div>
      </div>

      <CtaSection
        title={copy.ctaTitle}
        description={copy.ctaDescription}
        actions={[
          { label: copy.bookDemo, href: "/demo" },
          { label: copy.talkToTeam, href: "/contacto", variant: "secondary" },
        ]}
      />
    </div>
  )
}
