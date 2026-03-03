"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  Calculator,
  ChevronRight,
  Euro,
  Info,
  PercentCircle,
  ReceiptText,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BrandName } from "@/components/ui/brand-name"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GlassCard } from "@/components/ui/GlassCard"
import { Icon } from "@/components/ui/icon"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { storage } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { useROIStore } from "@/store/roi-store"
import { createSession } from "@/lib/api"
import { getRecaptchaToken } from "@/lib/recaptcha-client"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
} as const

const CONVERSION_IMPROVEMENTS = [
  { label: "Captación", pct: 4 },
  { label: "Atención IA", pct: 8 },
  { label: "Seguimiento", pct: 7 },
  { label: "Fidelización", pct: 5 },
] as const

const RECOVERY_RATE = CONVERSION_IMPROVEMENTS.reduce((acc, item) => acc + item.pct, 0) / 100

function formatEur(n: number) {
  return n.toLocaleString("es-ES") + "€"
}

export interface ROICalculatorProps {
  trigger?: ReactNode
  className?: string
}

export function ROICalculator({ trigger, className }: ROICalculatorProps) {
  const router = useRouter()
  const {
    monthlyPatients,
    averageTicket,
    conversionLoss,
    setMonthlyPatients,
    setAverageTicket,
    setConversionLoss,
    setHasAcceptedDialog,
    setAccessToken,
  } = useROIStore()

  const [mounted, setMounted] = useState(false)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [createSessionError, setCreateSessionError] = useState<string | null>(null)
  const [monthlyAdsSpend, setMonthlyAdsSpend] = useState(1000)

  useEffect(() => {
    setMounted(true)
    setHasAcceptedDialog(false)
    setAccessToken(null)
    storage.remove("local", "roi_access_token")
    setMonthlyPatients(100)
    setAverageTicket(500)
    setConversionLoss(20)
    setMonthlyAdsSpend(1000)
  }, [setAccessToken, setAverageTicket, setConversionLoss, setHasAcceptedDialog, setMonthlyPatients])

  const calculatingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSliderChange = (setter: (v: number) => void) => (value: number) => {
    setter(value)
    if (!isCalculating) setIsCalculating(true)
    if (calculatingTimeoutRef.current) clearTimeout(calculatingTimeoutRef.current)
    calculatingTimeoutRef.current = setTimeout(() => { setIsCalculating(false) }, 1000)
  }

  const monthlyLeads = monthlyPatients
  const currentConversion = conversionLoss
  const convertedLeads = monthlyLeads * (currentConversion / 100)
  const nonConvertedLeads = monthlyLeads - convertedLeads
  const extraConvertedLeadsRaw = nonConvertedLeads * RECOVERY_RATE
  const extraConvertedLeadsRounded = Math.round(extraConvertedLeadsRaw)
  const newConvertedLeadsRaw = convertedLeads + extraConvertedLeadsRaw
  const newConversion = monthlyLeads > 0 ? (newConvertedLeadsRaw / monthlyLeads) * 100 : 0

  const revenueWithoutAI = Math.round(convertedLeads * averageTicket)
  const revenueWithAI = Math.round(newConvertedLeadsRaw * averageTicket)
  const extraMonthlyRevenue = Math.max(0, revenueWithAI - revenueWithoutAI)

  const landingSetup = averageTicket <= 500 ? 1000 : averageTicket <= 2000 ? 1500 : 5000
  const setterAiSetup = monthlyLeads <= 1000 ? 500 : monthlyLeads <= 2500 ? 1000 : 1600
  const followupSetup = monthlyLeads <= 1000 ? 300 : monthlyLeads <= 2500 ? 600 : 1000
  const adsSetup = 1500
  const setupInitial = Math.max(0, landingSetup + setterAiSetup + followupSetup + adsSetup - 100)

  const leadOverageBlocks = Math.max(0, Math.ceil((monthlyLeads - 1000) / 500))
  const setterAiMonthly = 250 + leadOverageBlocks * 100
  const followupMonthly = 250 + leadOverageBlocks * 100
  const adsMonthly = monthlyAdsSpend < 1000 ? 700 : monthlyAdsSpend > 3000 ? 2500 : 1000
  const monthlyInvestment = setterAiMonthly + followupMonthly + adsMonthly + 150

  const roi3m = Math.round((((extraMonthlyRevenue * 3) - (setupInitial + monthlyInvestment * 3)) / (setupInitial + monthlyInvestment * 3)) * 100)
  const roi6m = Math.round((((extraMonthlyRevenue * 6) - (setupInitial + monthlyInvestment * 6)) / (setupInitial + monthlyInvestment * 6)) * 100)
  const roi12m = Math.round((((extraMonthlyRevenue * 12) - (setupInitial + monthlyInvestment * 12)) / (setupInitial + monthlyInvestment * 12)) * 100)
  const roi = roi12m
  const isPositive = roi12m > 0

  const SLIDERS = [
    { label: "Leads mensuales", icon: Users, value: monthlyLeads, setter: setMonthlyPatients, min: 100, max: 5000, step: 50, display: `${monthlyLeads}`, color: "primary" as const, hint: "Cantidad de leads" },
    { label: "Gasto en Ads mensual", icon: TrendingUp, value: monthlyAdsSpend, setter: setMonthlyAdsSpend, min: 500, max: 5000, step: 50, display: `${monthlyAdsSpend}€`, color: "accent" as const, hint: "Inversión en anuncios" },
    { label: "Ticket promedio cliente", icon: ReceiptText, value: averageTicket, setter: setAverageTicket, min: 100, max: 5000, step: 50, display: `${averageTicket}€`, color: "secondary" as const, hint: "Afecta el precio de landing page" },
    { label: "Conversión actual (%)", icon: PercentCircle, value: currentConversion, setter: setConversionLoss, min: 5, max: 60, step: 1, display: `${currentConversion}%`, color: "destructive" as const, hint: "Conversión sin automatización IA" },
  ] as const

  const METRICS = [
    { label: "Setup inicial", value: formatEur(setupInitial), icon: Calculator, variant: "muted" as const },
    { label: "Mensual", value: formatEur(monthlyInvestment), icon: Euro, variant: "muted" as const },
    { label: "ROI 3 meses", value: `${roi3m}%`, icon: TrendingUp, variant: roi3m >= 0 ? "success" as const : "destructive" as const },
    { label: "ROI 6 meses", value: `${roi6m}%`, icon: TrendingUp, variant: roi6m >= 0 ? "success" as const : "destructive" as const },
    { label: "ROI 12 meses", value: `${roi12m}%`, icon: TrendingUp, variant: roi12m >= 0 ? "primary" as const : "destructive" as const },
  ] as const

  const SERVICE_FEES = [
    { title: "Landing Page", setup: `${formatEur(landingSetup)} setup`, monthly: "—", note: "Premium: <=500€ = 1000€, 500-2000€ = 1500€, >2000€ = 5000€" },
    { title: "Setter de IA", setup: `${formatEur(setterAiSetup)} setup`, monthly: `${formatEur(setterAiMonthly)}/mes`, note: "Base: 1000 leads = 250€/mes, +500 leads = +100€/mes" },
    { title: "Setter de Seguimiento", setup: `${formatEur(followupSetup)} setup`, monthly: `${formatEur(followupMonthly)}/mes`, note: "Base: 1000 leads = 250€/mes, +500 leads = +100€/mes" },
    { title: "Pack Anuncios Setup", setup: `${formatEur(adsSetup)} setup`, monthly: `${formatEur(adsMonthly)}/mes`, note: "Setup 1500€ + mensual: <1k=700€, ~2k=1000€, >3k=2500€" },
  ] as const

  return (
    <div className={cn("relative", className)}>
      {trigger ? <div className="mb-8 flex justify-center">{trigger}</div> : null}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}><Badge variant="default" className="mb-6">Calculadora ROI - Genérico</Badge></motion.div>
          <motion.h1 {...fadeUp} transition={{ delay: 0.2 }} className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">Calcula el retorno de inversión para <span className="text-gradient-primary">clínicas veterinarias</span></motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.3 }} className="mx-auto max-w-3xl text-lg text-muted-foreground">Ajusta los parámetros y proyecta cuánto ingreso extra puedes recuperar con captación, atención IA, seguimiento y fidelización.</motion.p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-6">
              <GlassCard className="p-6 md:p-8 space-y-8">
                {SLIDERS.map((s) => (
                  <SliderField key={s.label} {...s} onChange={handleSliderChange(s.setter)} />
                ))}
              </GlassCard>

              <GlassCard className="p-5 space-y-4">
                <p className="text-base font-medium text-muted-foreground">Referencia de servicios y fees</p>
                <div className="space-y-3">
                  {SERVICE_FEES.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-primary">{item.setup}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                        <p className="text-xs font-semibold text-secondary whitespace-nowrap">{item.monthly}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {mounted && (
                <GlassCard className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon icon={Info} size="sm" className="text-muted-foreground" />
                    <p className="text-base font-medium text-muted-foreground">Modelo de referencia</p>
                  </div>
                  <div className="space-y-3">
                    <FormulaRow label="Leads no convertidos" formula={`${monthlyLeads} - ${(convertedLeads).toFixed(0)}`} result={`${Math.round(nonConvertedLeads)}`} color="text-muted-foreground" isCalculating={isCalculating} />
                    <FormulaRow label="Mejora total" formula={`${CONVERSION_IMPROVEMENTS.map((item) => `${item.label} +${item.pct}%`).join(" · ")}`} result={`+${Math.round(RECOVERY_RATE * 100)}% de leads perdidos`} color="text-primary" isCalculating={isCalculating} />
                    <FormulaRow label="Leads extra convertidos" formula={`${Math.round(nonConvertedLeads)} × ${Math.round(RECOVERY_RATE * 100)}%`} result={`${extraConvertedLeadsRounded}`} color="text-success" isCalculating={isCalculating} />
                    <FormulaRow label="Nueva conversión" formula={`${newConvertedLeadsRaw.toFixed(1)} / ${monthlyLeads}`} result={`${newConversion.toFixed(1)}%`} color="text-success" isCalculating={isCalculating} />
                    <div className="border-t border-white/10 pt-3" />
                    <FormulaRow label="SIN automatización IA" formula={`${Math.round(convertedLeads)} ventas`} result={formatEur(revenueWithoutAI)} color="text-muted-foreground" isCalculating={isCalculating} />
                    <FormulaRow label="CON automatización IA" formula={`${newConvertedLeadsRaw.toFixed(1)} ventas`} result={formatEur(revenueWithAI)} color="text-primary font-semibold" isCalculating={isCalculating} />
                    <FormulaRow label="Ingresos extra mensuales" formula={`+${extraConvertedLeadsRounded} ventas/mes`} result={`+${formatEur(extraMonthlyRevenue)}`} color="text-success font-semibold" isCalculating={isCalculating} />
                  </div>
                </GlassCard>
              )}
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-4">
              {mounted && (
                <>
                  <GlassCard className="p-6 text-center space-y-2">
                    <p className="text-base text-muted-foreground font-medium">Ingresos extra mensuales</p>
                    <AnimatePresence mode="wait">
                      {isCalculating ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-[3.75rem]"><Spinner size="lg" variant="primary" /></motion.div>
                      ) : (
                        <motion.p key={extraMonthlyRevenue} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl font-bold tabular-nums text-success drop-shadow-[0_0_20px_rgba(var(--success-rgb),0.5)]">+{formatEur(extraMonthlyRevenue)}</motion.p>
                      )}
                    </AnimatePresence>
                    <p className="text-base text-muted-foreground">{isCalculating ? "Calculando..." : `(${extraConvertedLeadsRounded} ventas extra cada mes)`}</p>
                  </GlassCard>

                  <div className="grid grid-cols-2 gap-3">
                    {METRICS.map((m) => (
                      <MetricCard key={m.label} {...m} isCalculating={isCalculating} />
                    ))}
                  </div>

                  <GlassCard className={cn("p-4 bg-gradient-to-br border-success/30", isPositive ? "from-success/10 via-background to-primary/5" : "from-background/60")}>
                    <p className="text-base text-center">De {Math.round(nonConvertedLeads)} leads no convertidos, convertirás <span className="font-bold text-success">{extraConvertedLeadsRounded}</span> más. Nueva conversión: <span className="font-bold text-success">{newConversion.toFixed(1)}%</span></p>
                  </GlassCard>
                </>
              )}

              <GlassCard className="p-5 space-y-4">
                <p className="text-lg font-medium">Inversión estimada</p>
                <p className="text-base text-muted-foreground leading-relaxed">Setup inicial: <span className="font-semibold text-foreground">{formatEur(setupInitial)}</span> · Mensual: <span className="font-semibold text-foreground">{formatEur(monthlyInvestment)}/mes</span></p>
                <div className="mt-3 border-t border-white/10 pt-4 text-center font-semibold text-success">ROI 3m: {roi3m}% · ROI 6m: {roi6m}% · ROI 12m: {roi12m}%</div>
              </GlassCard>

              <Button size="lg" className="w-full gap-2" onClick={() => setShowSkipDialog(true)}>
                Hablar con el equipo
                <Icon icon={ChevronRight} size="sm" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <ResultDialog
        open={showSkipDialog}
        onOpenChange={setShowSkipDialog}
        data={{ monthlyPatients, averageTicket, conversionLoss, roi }}
        isSubmitting={isCreatingSession}
        error={createSessionError}
        onConfirm={async () => {
          setIsCreatingSession(true)
          setCreateSessionError(null)
          try {
            const recaptchaToken = await getRecaptchaToken("session_create")
            const session = await createSession({
              roi: { monthlyPatients, averageTicket, conversionLoss, roi },
              recaptchaToken,
            })
            if (!session?.accessToken) {
              throw new Error("No se pudo crear el token de sesión")
            }
            setHasAcceptedDialog(true)
            setAccessToken(session.accessToken)
            storage.set("local", "roi_access_token", session.accessToken)
            setShowSkipDialog(false)
            router.push("/contacto")
          } catch (error) {
            setCreateSessionError(error instanceof Error ? error.message : "No se pudo crear tu sesión. Inténtalo de nuevo.")
          } finally {
            setIsCreatingSession(false)
          }
        }}
      />
    </div>
  )
}

type SliderColor = "primary" | "secondary" | "destructive" | "accent"

function SliderField({ label, icon: IconComponent, value, onChange, min, max, step, display, color, hint }: { label: string, icon: LucideIcon, value: number, onChange: (v: number) => void, min: number, max: number, step: number, display: string, color: SliderColor, hint?: string }) {
  const colorMap = { primary: "text-primary", secondary: "text-neon-pink", destructive: "text-destructive", accent: "text-accent" }
  const dotMap = { primary: "bg-primary", secondary: "bg-neon-pink", destructive: "bg-destructive", accent: "bg-accent" }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`text-base font-medium flex items-center gap-2 ${colorMap[color]}`}>
          <span className={`h-2 w-2 rounded-full ${dotMap[color]}`} />
          <span className="text-foreground/80">{label}</span>
          <Icon icon={IconComponent} size="sm" />
        </label>
        <span className={`text-base font-bold tabular-nums ${colorMap[color]}`}>{display}</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} className="py-1" />
      <div className="flex items-center justify-between text-base text-muted-foreground"><span>{min}</span><span className="opacity-60">{hint}</span><span>{max}</span></div>
    </div>
  )
}

function FormulaRow({ label, formula, result, color, isCalculating }: { label: string; formula: string; result: string; color: string; isCalculating?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0"><p className="text-base text-muted-foreground truncate">{label}</p><p className="text-base font-mono text-muted-foreground/60 truncate">{formula}</p></div>
      {isCalculating ? <Spinner size="sm" variant="default" /> : <span className={`text-base font-semibold tabular-nums ${color}`}>{result}</span>}
    </div>
  )
}

type MetricVariant = "primary" | "destructive" | "success" | "muted"

function MetricCard({ label, value, icon: IconComponent, variant, isCalculating }: { label: string; value: string; icon: LucideIcon; variant: MetricVariant; isCalculating?: boolean }) {
  const styles: Record<MetricVariant, string> = { primary: "border-primary/30 bg-primary/5 text-primary", destructive: "border-destructive/30 bg-destructive/5 text-destructive", success: "border-success/30 bg-success/5 text-success", muted: "border-white/10 bg-white/5 text-muted-foreground" }
  const iconVariantMap: Record<MetricVariant, "primary" | "destructive" | "muted"> = { primary: "primary", destructive: "destructive", success: "primary", muted: "muted" }
  return (
    <div className={`rounded-xl border p-3 space-y-1 ${styles[variant]}`}>
      <div className="flex items-center gap-1.5 opacity-70">
        <Icon icon={IconComponent} size="sm" variant={iconVariantMap[variant]} />
        <span className="text-base font-medium">{label}</span>
      </div>
      {isCalculating ? <div className="flex items-center justify-center h-7"><Spinner size="default" variant="default" /></div> : <p className="text-lg font-bold tabular-nums">{value}</p>}
    </div>
  )
}

interface ResultDialogData {
  monthlyPatients: number
  averageTicket: number
  conversionLoss: number
  roi: number
}

function ResultDialog({ open, onOpenChange, data, onConfirm, isSubmitting, error }: { open: boolean; onOpenChange: (open: boolean) => void; data: ResultDialogData; onConfirm: () => Promise<void> | void; isSubmitting: boolean; error?: string | null }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary">
            <Icon icon={Calculator} size="lg" variant="primary" />
          </div>
          <DialogTitle className="text-center text-xl">¿Enviar estos datos a <BrandName />?</DialogTitle>
          <DialogDescription className="text-center text-base">Obtendrás un feedback personalizado mucho más exacto.</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2 text-base">
          {[{ l: "Leads/mes", v: data.monthlyPatients }, { l: "Ticket medio", v: `${data.averageTicket}€` }, { l: "Conversión actual", v: `${data.conversionLoss}%` }].map(i => (
            <div key={i.l} className="flex justify-between"><span>{i.l}:</span><span className="font-semibold">{i.v}</span></div>
          ))}
          <div className="border-t border-primary/20 pt-2 mt-2 flex justify-between"><span>ROI proyectado:</span><span className="font-bold text-success">{data.roi}%</span></div>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter className="mt-4 gap-2">
          <Button variant="destructive" className="w-full bg-destructive/15 border-2 border-destructive/70 text-destructive shadow-[0_0_20px_rgba(var(--destructive-rgb),0.50)]" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
          <Button variant="default" className="w-full" onClick={() => { void onConfirm() }} disabled={isSubmitting}>
            {isSubmitting ? "Creando acceso..." : "Continuar"}
            <Icon icon={ArrowRight} size="sm" className="ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
