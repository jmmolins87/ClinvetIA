import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/GlassCard"

const blocks = [
  {
    title: "Captación de leads cualificados",
    text: "Diseñamos campañas y activos para atraer clínicas veterinarias con intención real de compra.",
  },
  {
    title: "Atención automática con IA",
    text: "Respondemos en segundos para que no se pierdan oportunidades por tiempos de respuesta lentos.",
  },
  {
    title: "Seguimiento comercial",
    text: "Automatizamos el follow-up para recuperar leads fríos y aumentar conversiones.",
  },
  {
    title: "Medición de ROI",
    text: "Panel claro con resultados de ingresos, citas y rendimiento de cada canal.",
  },
] as const

export default function AgenciaMarketingVeterinariaPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="text-center">
          <Badge variant="secondary">Servicios</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Agencia marketing veterinaria especializada en crecimiento
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            En ClinvetIA combinamos estrategia de captación, automatización y seguimiento para ayudarte a convertir más
            leads en citas y ventas recurrentes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map((item) => (
            <GlassCard key={item.title} className="p-5">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold">Para quién es esta solución</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Clínicas veterinarias que quieren más volumen de citas, mejor conversión de leads y menos carga manual en
            recepción.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/demo">Reservar demo</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/calculadora">Calcular ROI</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
