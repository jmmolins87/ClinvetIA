import Link from "next/link";

import {
  NeonCard,
  NeonCardDescription,
  NeonCardHeader,
  NeonCardTitle,
} from "@/components/ui/neon-card";
import { DemoButton } from "@/components/cta/demo-button";
import { RoiButton } from "@/components/cta/roi-button";
import { SiteCta } from "@/components/blocks/site-cta";
import { Icon, type IconName } from "@/components/ui/icon";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="w-full">
      <section
        id="hero"
        className="home-reflections relative w-full min-h-[calc(100dvh-4rem)] overflow-hidden bg-background text-foreground"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 pt-12 pb-16 md:pt-16 md:pb-24 min-h-[calc(100dvh-4rem)] flex flex-col justify-center">
          <div className="mx-auto w-full max-w-5xl text-center">
            <div className="flex justify-center">
              <Logo width={720} height={180} className="hidden h-20 w-auto md:block" priority />
            </div>

            <h1 className="hero-title mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Inteligencia aplicada a la atencion veterinaria.
            </h1>
            <p className="hero-subtitle mx-auto mt-5 max-w-3xl text-lg font-medium text-foreground/85 sm:text-xl md:text-2xl">
              Cada consulta sin responder es un cliente que se va a otra clinica.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <DemoButton asChild className="w-full sm:w-auto">
                <Link href="/reservar">Reservar demo</Link>
              </DemoButton>
              <RoiButton asChild className="w-full sm:w-auto">
                <Link href="/roi">Ver ROI</Link>
              </RoiButton>
            </div>

            <div className="mt-8">
              <Link
                href="#problem-section"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Descubre mas</span>
                <Icon name="ArrowDown" size={18} aria-label="Bajar" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="problem-section"
        className="home-reflections home-surface-problem home-shadow-problem scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="Problema"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Te resulta familiar?
            </h2>
            <p className="mt-3 text-xl font-semibold text-destructive sm:text-2xl">
              Cada dia pierdes clientes por problemas que tienen solucion
            </p>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">
              Tu equipo hace lo que puede, pero el telefono no para y WhatsApp se desborda con consultas.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6">
            {([
              {
                icon: "MessageCircle",
              title: "Urgencias nocturnas perdidas",
              desc: "Un dueno escribe tarde. Respondes por la manana. Ya fue a otra clinica.",
              },
              {
                icon: "Users",
              title: "Recepcion desbordada",
              desc: "Entre agenda, cobros y consultas, siempre queda algo pendiente.",
              },
              {
                icon: "CircleAlert",
              title: "Citas que se escapan",
              desc: "Preguntan por cita. Tardas en responder. Cliente perdido.",
              },
              {
                icon: "Calendar",
              title: "Recordatorios manuales",
              desc: "Vacunas y revisiones requieren llamadas o mensajes uno a uno.",
              },
            ] satisfies Array<{ icon: IconName; title: string; desc: string }>).map(
              (item) => (
              <NeonCard key={item.title} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="flex-row items-start gap-4">
                  <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-orange-500 text-white shadow-sm">
                    <Icon name={item.icon} size={22} aria-label={item.title} />
                  </div>
                  <div className="min-w-0">
                    <NeonCardTitle className="text-xl leading-tight">{item.title}</NeonCardTitle>
                    <NeonCardDescription className="mt-1 text-sm">{item.desc}</NeonCardDescription>
                  </div>
                </NeonCardHeader>
              </NeonCard>
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="system-section"
        className="home-reflections home-surface-system home-shadow-system scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="Sistema"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Sistema de Atencion Inteligente
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">
              No es un chatbot. Es un sistema que entiende consultas, clasifica urgencias, verifica disponibilidad y agenda citas.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {([
              {
                icon: "Brain",
              title: "Comprende consultas veterinarias",
              desc: "Interpreta sintomas y distingue urgencias de consultas rutinarias.",
              },
              {
                icon: "Clock",
              title: "Verifica agenda en tiempo real",
              desc: "Consulta huecos para urgencias, vacunas o revisiones al instante.",
              },
              {
                icon: "CalendarCheck",
              title: "Agenda automaticamente",
              desc: "Reserva y confirma la cita con el dueno, sin ida y vuelta.",
              },
              {
                icon: "BellRing",
              title: "Recordatorios automaticos",
              desc: "Avisos de vacunas, revisiones y seguimientos de tratamientos.",
              },
            ] satisfies Array<{ icon: IconName; title: string; desc: string }>).map(
              (item) => (
              <NeonCard key={item.title} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="items-center text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                    <Icon name={item.icon} size={22} aria-label={item.title} />
                  </div>
                  <NeonCardTitle className="mt-4 text-lg">{item.title}</NeonCardTitle>
                  <NeonCardDescription className="mt-2">{item.desc}</NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
              )
            )}
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <NeonCard className="relative bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
              <NeonCardHeader className="text-center">
                <div className="mx-auto -mt-10 w-fit rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm dark:glow-primary">
                  40% de consultas llegan fuera de horario
                </div>
                <NeonCardDescription className="mt-4 text-base text-foreground/80">
                  Si no respondes cuando ocurre la consulta, no existe una segunda oportunidad.
                </NeonCardDescription>
              </NeonCardHeader>
            </NeonCard>
          </div>
        </div>
      </section>

      <section
        id="flow-section"
        className="home-reflections home-surface-flow home-shadow-flow scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="Flujo"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Flujo sin fricciones
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">
              Desde la consulta del dueno hasta la cita confirmada, sin intervencion manual.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6">
            {[{
              step: "1",
              title: "Dueno consulta por WhatsApp",
              desc: "Disponible 24/7 para responder sintomas, vacunas y urgencias.",
            }, {
              step: "2",
              title: "Clasifica y verifica",
              desc: "Distingue urgencia vs rutina y comprueba disponibilidad.",
            }, {
              step: "3",
              title: "Propone opciones",
              desc: "Ofrece huecos segun el tipo de consulta y preferencia.",
            }, {
              step: "4",
              title: "Confirma y recuerda",
              desc: "Reserva, confirma y envia recordatorios con instrucciones.",
            }].map((item) => (
              <NeonCard key={item.title} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground font-bold">
                      {item.step}
                    </div>
                    <NeonCardTitle className="text-xl">{item.title}</NeonCardTitle>
                  </div>
                  <NeonCardDescription className="mt-2 text-sm">{item.desc}</NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section
        id="benefits-section"
        className="home-reflections home-surface-benefits home-shadow-benefits scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="Beneficios"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Beneficios operativos
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">
              Menos carga administrativa, urgencias 24/7 y agenda mas optimizada.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6">
            {([
              {
                icon: "Zap",
              title: "Urgencias 24/7",
              desc: "Captura y clasifica urgencias nocturnas y fines de semana.",
              },
              {
                icon: "TrendingUp",
              title: "Menos llamadas repetitivas",
              desc: "Libera tiempo del equipo para atender a las mascotas.",
              },
              {
                icon: "Heart",
              title: "Duenos tranquilos",
              desc: "Respuestas inmediatas sobre vacunas, sintomas y citas.",
              },
              {
                icon: "Target",
              title: "Recordatorios automaticos",
              desc: "Vacunas, revisiones y seguimientos siempre al dia.",
              },
            ] satisfies Array<{ icon: IconName; title: string; desc: string }>).map(
              (item) => (
              <NeonCard key={item.title} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="flex-row items-start gap-4">
                  <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                    <Icon name={item.icon} size={22} aria-label={item.title} />
                  </div>
                  <div className="min-w-0">
                    <NeonCardTitle className="text-xl leading-tight text-gradient-to dark:text-primary">
                      {item.title}
                    </NeonCardTitle>
                    <NeonCardDescription className="mt-1 text-sm">{item.desc}</NeonCardDescription>
                  </div>
                </NeonCardHeader>
              </NeonCard>
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="scenarios-section"
        className="home-reflections home-surface-scenarios home-shadow-scenarios scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="Escenarios"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Casos veterinarios reales
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">
              Situaciones del dia a dia en tu clinica, resueltas con atencion inteligente.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {([
              {
                icon: "CircleAlert",
              title: "Urgencias nocturnas",
              desc: "Sintomas graves, accidentes, consultas fuera de horario.",
              },
              {
                icon: "Syringe",
              title: "Medicina preventiva",
              desc: "Vacunas, desparasitaciones, revisiones anuales.",
              },
              {
                icon: "Activity",
              title: "Tratamientos cronicos",
              desc: "Seguimiento de diabeticos, renales, cardiacos.",
              },
              {
                icon: "Scissors",
              title: "Multiples servicios",
              desc: "Consulta, peluqueria, analisis, cirugias.",
              },
            ] satisfies Array<{ icon: IconName; title: string; desc: string }>).map(
              (item) => (
              <NeonCard key={item.title} className="bg-background/55 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="items-center text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                    <Icon name={item.icon} size={22} aria-label={item.title} />
                  </div>
                  <NeonCardTitle className="mt-4 text-lg">{item.title}</NeonCardTitle>
                  <NeonCardDescription className="mt-2">{item.desc}</NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
              )
            )}
          </div>

          <div className="mt-10 text-center">
            <DemoButton asChild>
              <Link href="/escenarios">Ver casos de uso</Link>
            </DemoButton>
          </div>
        </div>
      </section>

      <section
        id="roi-section"
        className="home-reflections home-surface-roi home-shadow-roi scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="ROI"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Cuantos clientes pierdes cada mes?
            </h2>
            <p className="mt-4 text-base text-foreground/80 sm:text-lg">
              Cada consulta sin responder es un dueno que se va a otra clinica. El impacto es real.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3 md:gap-6">
            {[{
              value: "80%",
              label: "de duenos esperan respuesta inmediata",
            }, {
              value: "67%",
              label: "se van tras 24h sin respuesta",
            }, {
              value: "+35%",
              label: "aumento en consultas capturadas",
            }].map((stat) => (
              <NeonCard key={stat.label} className="bg-card/80 backdrop-blur-sm" hover glow>
                <NeonCardHeader className="items-center text-center">
                  <div className="text-4xl font-bold text-gradient-to dark:text-primary">
                    {stat.value}
                  </div>
                  <NeonCardDescription className="mt-2 text-sm">
                    {stat.label}
                  </NeonCardDescription>
                </NeonCardHeader>
              </NeonCard>
            ))}
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6">
            <NeonCard className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
              <NeonCardHeader className="flex-row items-start gap-4">
                <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground">
                  <Icon name="Euro" size={22} aria-label="Impacto economico" />
                </div>
                <div className="min-w-0">
                  <NeonCardTitle className="text-xl">Mas consultas, menos huecos vacios</NeonCardTitle>
                  <NeonCardDescription className="mt-1 text-sm">
                    Captura urgencias, recordatorios y citas de seguimiento que antes se perdian.
                  </NeonCardDescription>
                </div>
              </NeonCardHeader>
            </NeonCard>

            <NeonCard className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
              <NeonCardHeader className="flex-row items-start gap-4">
                <div className="mt-1 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground">
                  <Icon name="Clock" size={22} aria-label="Impacto en tiempo" />
                </div>
                <div className="min-w-0">
                  <NeonCardTitle className="text-xl">Tu equipo se enfoca en las mascotas</NeonCardTitle>
                  <NeonCardDescription className="mt-1 text-sm">
                    Menos tiempo respondiendo dudas repetitivas y mas tiempo atendiendo.
                  </NeonCardDescription>
                </div>
              </NeonCardHeader>
            </NeonCard>
          </div>

          <div className="mt-10 text-center">
            <RoiButton asChild>
              <Link href="/roi">Calcular mi ROI</Link>
            </RoiButton>
          </div>
        </div>
      </section>

      <section
        id="final-cta-section"
        className="home-reflections home-surface-final home-shadow-final scroll-mt-20 min-h-[calc(100dvh-4rem)] flex items-center"
        aria-label="CTA final"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-20 md:py-28">
          <SiteCta
            title="Empieza a capturar cada consulta"
            description="Agenda una demo y descubre como el Sistema de Atencion Inteligente transforma tu clinica veterinaria."
            demoLabel="Reservar demo"
            demoHref="/reservar"
            roiLabel="Calcular ROI"
            roiHref="/roi"
            className="max-w-3xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}
