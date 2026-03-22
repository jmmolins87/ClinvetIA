"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

import { useTranslationSkeleton } from "@/components/providers/translation-skeleton"
import { getSeoLandingConfig, seoLandings } from "@/lib/seo-landings"

const routeMetadata = {
  es: {
    "/": {
      title: "Clinvetia — Software veterinario con IA",
      description:
        "Clinvetia automatiza la gestión de tu clínica veterinaria con agentes de inteligencia artificial. Comprende consultas, clasifica urgencias y agenda citas automáticamente.",
    },
    "/solucion": {
      title: "Solución",
      description:
        "Conoce la solución de IA veterinaria de Clinvetia para atención, triaje, agenda y seguimiento automatizado.",
    },
    "/como-funciona": {
      title: "Cómo funciona",
      description:
        "Descubre el flujo completo de Clinvetia: recepción de consultas, triaje inteligente y agendado automático.",
    },
    "/escenarios": {
      title: "Escenarios",
      description:
        "Explora casos reales de uso de Clinvetia en clínicas veterinarias: urgencias, seguimiento y fidelización.",
    },
    "/contacto": {
      title: "Contacto",
      description:
        "Contacta con Clinvetia para resolver dudas y recibir una propuesta adaptada a tu clínica veterinaria.",
    },
    "/calculadora": {
      title: "Calculadora ROI",
      description:
        "Calcula en minutos el impacto económico de automatizar la atención y agenda de tu clínica veterinaria.",
    },
    "/demo": {
      title: "Reservar demo",
      description:
        "Reserva una demo de Clinvetia y descubre cómo automatizar consultas, triaje y citas en tu clínica veterinaria.",
    },
    "/faqs": {
      title: "Preguntas frecuentes",
      description:
        "Resuelve tus dudas sobre Clinvetia: precios, implementación, tiempos, integraciones y resultados para clínicas veterinarias.",
    },
    "/agencia-marketing-veterinaria": {
      title: "Agencia marketing veterinaria",
      description:
        "Clinvetia es una agencia de marketing veterinario especializada en captación, automatización IA y seguimiento comercial para clínicas veterinarias.",
    },
    "/recursos-ia-veterinaria": {
      title: "Recursos de IA veterinaria",
      description:
        "Explora recursos y páginas de Clinvetia sobre software veterinario con IA, automatización, citas, triaje, recepción y captación para clínicas veterinarias.",
    },
    "/privacy": {
      title: "Política de privacidad",
      description:
        "Información detallada sobre cómo protegemos y gestionamos tus datos personales.",
    },
    "/terms": {
      title: "Términos de uso",
      description:
        "Términos y condiciones legales para el uso de la plataforma Clinvetia.",
    },
    "/security": {
      title: "Seguridad",
      description:
        "Detalles sobre nuestras medidas de seguridad y protección de la infraestructura.",
    },
    "/cookies": {
      title: "Política de cookies",
      description:
        "Información sobre cómo utilizamos las cookies para mejorar tu experiencia.",
    },
  },
  en: {
    "/": {
      title: "Clinvetia — AI Veterinary Software",
      description:
        "Clinvetia automates veterinary clinic operations with AI agents that understand inquiries, triage urgent cases, and book appointments automatically.",
    },
    "/solucion": {
      title: "Solution",
      description:
        "Learn about Clinvetia's AI solution for veterinary replies, triage, scheduling, and automated follow-up.",
    },
    "/como-funciona": {
      title: "How it works",
      description:
        "Discover the full Clinvetia workflow: inquiry handling, smart triage, and automated appointment booking.",
    },
    "/escenarios": {
      title: "Scenarios",
      description:
        "Explore real Clinvetia use cases for veterinary clinics: emergencies, follow-up, and retention.",
    },
    "/contacto": {
      title: "Contact",
      description:
        "Contact Clinvetia to resolve questions and receive a proposal tailored to your veterinary clinic.",
    },
    "/calculadora": {
      title: "ROI Calculator",
      description:
        "Calculate in minutes the economic impact of automating care and scheduling in your veterinary clinic.",
    },
    "/demo": {
      title: "Book demo",
      description:
        "Book a Clinvetia demo and see how to automate inquiries, triage, and appointments in your veterinary clinic.",
    },
    "/faqs": {
      title: "Frequently asked questions",
      description:
        "Resolve your questions about Clinvetia: pricing, implementation, timelines, integrations, and results for veterinary clinics.",
    },
    "/agencia-marketing-veterinaria": {
      title: "Veterinary marketing agency",
      description:
        "Clinvetia is a veterinary marketing agency specialized in lead generation, AI automation, and commercial follow-up for veterinary clinics.",
    },
    "/recursos-ia-veterinaria": {
      title: "Veterinary AI resources",
      description:
        "Explore Clinvetia resources and pages about AI veterinary software, automation, appointments, triage, reception, and acquisition for veterinary clinics.",
    },
    "/privacy": {
      title: "Privacy policy",
      description:
        "Detailed information about how we protect and manage your personal data.",
    },
    "/terms": {
      title: "Terms of use",
      description:
        "Legal terms and conditions for using the Clinvetia platform.",
    },
    "/security": {
      title: "Security",
      description:
        "Details about our security measures and infrastructure protection.",
    },
    "/cookies": {
      title: "Cookie policy",
      description:
        "Information about how we use cookies to improve your experience.",
    },
  },
} as const

function resolveDocumentMetadata(pathname: string, locale: "es" | "en") {
  const exact = routeMetadata[locale][pathname as keyof (typeof routeMetadata)[typeof locale]]
  if (exact) return exact

  const slug = pathname.replace(/^\/+/, "")
  if (slug && slug in seoLandings) {
    const config = getSeoLandingConfig(slug, locale)
    return {
      title: config.metaTitle,
      description: config.metaDescription,
    }
  }

  return null
}

function upsertMetaDescription(description: string) {
  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement("meta")
    meta.setAttribute("name", "description")
    document.head.appendChild(meta)
  }
  meta.setAttribute("content", description)
}

function formatDocumentTitle(title: string) {
  return title.startsWith("Clinvetia") ? title : `${title} · Clinvetia`
}

export function LocalizedDocumentMetadata() {
  const pathname = usePathname()
  const { locale } = useTranslationSkeleton()

  useLayoutEffect(() => {
    if (!pathname) return

    const metadata = resolveDocumentMetadata(pathname, locale)
    if (!metadata) return

    const apply = () => {
      document.title = formatDocumentTitle(metadata.title)
      upsertMetaDescription(metadata.description)
    }

    apply()
    const raf = window.requestAnimationFrame(apply)
    const timer = window.setTimeout(apply, 0)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [pathname, locale])

  return null
}
