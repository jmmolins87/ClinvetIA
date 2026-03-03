import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/GlassCard"

const FAQS = [
  {
    question: "Qué es ClinvetIA?",
    answer:
      "ClinvetIA es un sistema de automatización con IA para clínicas veterinarias que capta leads, responde consultas y ayuda a cerrar más citas.",
  },
  {
    question: "En cuánto tiempo se puede implementar?",
    answer:
      "Normalmente el setup inicial puede estar listo en pocos días, según el volumen de canales, agenda y configuración comercial.",
  },
  {
    question: "Sirve para clínicas pequeñas?",
    answer:
      "Sí. El sistema está pensado tanto para clínicas independientes como para grupos con varias sedes.",
  },
  {
    question: "Puede responder fuera de horario?",
    answer:
      "Sí, opera 24/7 para no perder oportunidades cuando recepción no está disponible.",
  },
  {
    question: "Cómo se mide el retorno?",
    answer:
      "Con métricas de leads recuperados, citas agendadas, ventas adicionales y ROI en periodos de 3, 6 y 12 meses.",
  },
] as const

export default function FaqsPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center">
          <Badge variant="secondary">FAQ</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Preguntas frecuentes sobre ClinvetIA</h1>
          <p className="mt-4 text-muted-foreground">
            Respuestas rápidas sobre implementación, operación y resultados.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item) => (
            <GlassCard key={item.question} className="p-5">
              <h2 className="text-lg font-semibold">{item.question}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/demo">Reservar demo</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/contacto">Hablar con el equipo</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
