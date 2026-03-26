import Link from "next/link"
import {
  ArrowRight,
  BookOpenText,
  CalendarClock,
  CircleHelp,
  ClipboardList,
  FileStack,
  Funnel,
  Megaphone,
  MessageCircleMore,
  Route,
  Stethoscope,
  Syringe,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

export interface SeoCardProps {
  title: string
  description: string
  href?: string
  icon?: LucideIcon
  className?: string
}

const keywordIconMap: Array<{ match: string; icon: LucideIcon }> = [
  { match: "recurso", icon: BookOpenText },
  { match: "solución", icon: Stethoscope },
  { match: "solucion", icon: Stethoscope },
  { match: "software", icon: FileStack },
  { match: "cómo funciona", icon: Workflow },
  { match: "como funciona", icon: Workflow },
  { match: "escenario", icon: Route },
  { match: "pregunta", icon: CircleHelp },
  { match: "gestión", icon: ClipboardList },
  { match: "gestion", icon: ClipboardList },
  { match: "marketing", icon: Megaphone },
  { match: "captación", icon: Megaphone },
  { match: "captacion", icon: Megaphone },
  { match: "whatsapp", icon: MessageCircleMore },
  { match: "automatización", icon: Syringe },
  { match: "automatizacion", icon: Syringe },
  { match: "recordatorio", icon: CalendarClock },
  { match: "cita", icon: CalendarClock },
  { match: "triaje", icon: ClipboardList },
  { match: "recepción", icon: MessageCircleMore },
  { match: "recepcion", icon: MessageCircleMore },
  { match: "conversión", icon: ArrowRight },
  { match: "conversion", icon: ArrowRight },
  { match: "embudo", icon: Funnel },
]

export function resolveSeoCardIcon(input: { title: string; href?: string; description?: string; icon?: LucideIcon }) {
  if (input.icon) {
    return input.icon
  }

  const normalized = `${input.title} ${input.href ?? ""} ${input.description ?? ""}`.toLocaleLowerCase("es-ES")
  const matchedIcon = keywordIconMap.find(({ match }) => normalized.includes(match))

  return matchedIcon?.icon ?? BookOpenText
}

export function SeoCard({ title, description, href, icon, className }: SeoCardProps) {
  const ItemIcon = resolveSeoCardIcon({ title, href, description, icon })
  const content = (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-white/55 shadow-[inset_0_1px_0_rgba(var(--white-rgb),0.75),0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:border-primary/35 group-hover:bg-white/70 group-hover:shadow-[inset_0_1px_0_rgba(var(--white-rgb),0.85),0_14px_30px_rgba(var(--primary-rgb),0.14)] dark:bg-white/8 dark:group-hover:bg-white/12">
            <Icon icon={ItemIcon} variant="primary" size="default" />
          </div>
          {href ? (
            <Icon
              icon={ArrowRight}
              variant="muted"
              size="sm"
              className="mt-1 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
            />
          ) : null}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-foreground">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
    </>
  )

  return (
    <GlassCard
      className={cn(
        "group flex h-full overflow-hidden p-0 transition-all duration-300",
        "border-white/45 hover:-translate-y-1 hover:border-primary/45",
        "hover:shadow-[0_18px_45px_rgba(15,23,42,0.12),0_0_30px_rgba(var(--primary-rgb),0.12)]",
        className,
      )}
    >
      {href ? (
        <Link
          href={href}
          className="relative flex h-full w-full flex-col rounded-[inherit] p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </Link>
      ) : (
        <div className="relative flex h-full w-full flex-col rounded-[inherit] p-5">
          {content}
        </div>
      )}
    </GlassCard>
  )
}
