import type { Metadata } from "next"

import { SeoResourcesPage } from "@/components/marketing/seo-resources-page"

export const metadata: Metadata = {
  title: "Recursos de IA veterinaria",
  description:
    "Explora recursos y páginas de Clinvetia sobre software veterinario con IA, automatización, citas, triaje, recepción y captación para clínicas veterinarias.",
  alternates: {
    canonical: "/recursos-ia-veterinaria",
  },
  openGraph: {
    title: "Recursos de IA veterinaria",
    description:
      "Hub SEO de Clinvetia con páginas sobre automatización, citas, triaje, recepción, chatbot y captación para clínicas veterinarias.",
    url: "/recursos-ia-veterinaria",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos de IA veterinaria",
    description:
      "Hub SEO de Clinvetia con páginas sobre automatización, citas, triaje, recepción, chatbot y captación para clínicas veterinarias.",
  },
}

export default function RecursosIaVeterinariaPage() {
  return <SeoResourcesPage />
}
