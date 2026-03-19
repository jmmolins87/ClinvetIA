"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { DayButtonProps } from "react-day-picker"
import { CalendarCheck2, CalendarDays, Check, Video, X } from "lucide-react"

import { BookingWizard, type BookingWizardSubmitPayload } from "@/components/scheduling/BookingWizard"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

type CalendarBooking = {
  id: string
  date: string
  time: string
  duration: number
  status: string
  nombre?: string
  clinica?: string
  email?: string
  googleMeetLink?: string | null
}

type CalendarActionType = "confirm" | "cancel" | "reschedule" | "meet"

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function bookingDateKey(date: string) {
  return date.slice(0, 10)
}

function isSameMonthDate(date: Date, month: Date) {
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
}

function sortBookingsByDateTime(bookings: CalendarBooking[]) {
  return bookings.slice().sort((left, right) => {
    const leftValue = new Date(`${bookingDateKey(left.date)}T${left.time}:00`).getTime()
    const rightValue = new Date(`${bookingDateKey(right.date)}T${right.time}:00`).getTime()
    return leftValue - rightValue
  })
}

function statusLabel(status: string) {
  if (status === "confirmed") return "Confirmada"
  if (status === "pending") return "Pendiente"
  if (status === "cancelled") return "Cancelada"
  if (status === "expired") return "Expirada"
  return status
}

function statusBadgeVariant(status: string): "primary" | "warning" | "destructive" | "outline" | "secondary" | "accent" {
  if (status === "confirmed") return "primary"
  if (status === "pending") return "warning"
  if (status === "cancelled") return "secondary"
  if (status === "expired") return "destructive"
  return "accent"
}

export default function AdminCalendarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<CalendarBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<"demo" | "admin" | "superadmin" | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const [activeBooking, setActiveBooking] = useState<CalendarBooking | null>(null)
  const [confirmAction, setConfirmAction] = useState<CalendarActionType | null>(null)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [rescheduleBooking, setRescheduleBooking] = useState<CalendarBooking | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [dayPage, setDayPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [dayPageLoading, setDayPageLoading] = useState<"prev" | "next" | null>(null)
  const [upcomingPageLoading, setUpcomingPageLoading] = useState<"prev" | "next" | null>(null)

  const load = useCallback(async () => {
    try {
      const meRes = await fetch("/api/admin/me", { cache: "no-store" })
      if (meRes.status === 401) {
        router.push("/admin/login")
        return
      }
      const mePayload = await meRes.json().catch(() => null)
      setMode(mePayload?.admin?.role ?? null)

      const res = await fetch("/api/admin/bookings", { cache: "no-store" })
      if (res.status === 401) {
        router.push("/admin/login")
        return
      }
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error || "No se pudieron cargar las citas")
      }
      const payload = (await res.json()) as { bookings?: CalendarBooking[] }
      setBookings(Array.isArray(payload.bookings) ? payload.bookings : [])
    } catch (err) {
      toast({
        variant: "destructive",
        title: "No se pudo cargar el calendario",
        description: err instanceof Error ? err.message : "Error al cargar citas",
      })
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "clinvetia:booking-updated") return
      load()
    }
    const onLocalEvent = () => load()
    window.addEventListener("storage", onStorage)
    window.addEventListener("clinvetia:booking-updated", onLocalEvent)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("clinvetia:booking-updated", onLocalEvent)
    }
  }, [load])

  const bookingStatusCountsByDate = useMemo(() => {
    return bookings.reduce<Record<string, { pending: number; confirmed: number; cancelled: number; expired: number }>>((acc, booking) => {
      const key = bookingDateKey(booking.date)
      if (!acc[key]) {
        acc[key] = { pending: 0, confirmed: 0, cancelled: 0, expired: 0 }
      }
      if (booking.status === "pending") acc[key].pending += 1
      if (booking.status === "confirmed") acc[key].confirmed += 1
      if (booking.status === "cancelled") acc[key].cancelled += 1
      if (booking.status === "expired") acc[key].expired += 1
      return acc
    }, {})
  }, [bookings])
  const bookedDates = useMemo(() => {
    return Object.keys(bookingStatusCountsByDate).map((key) => {
      const [year, month, day] = key.split("-").map(Number)
      return new Date(year, month - 1, day)
    })
  }, [bookingStatusCountsByDate])
  const selectedKey = dateKey(selectedDate)
  const selectedDayBookings = useMemo(() => {
    return sortBookingsByDateTime(bookings.filter((booking) => bookingDateKey(booking.date) === selectedKey))
  }, [bookings, selectedKey])
  const dayPageSize = 4
  const totalDayPages = Math.max(1, Math.ceil(selectedDayBookings.length / dayPageSize))
  const safeDayPage = Math.min(dayPage, totalDayPages)
  const pagedSelectedDayBookings = useMemo(() => {
    const start = (safeDayPage - 1) * dayPageSize
    return selectedDayBookings.slice(start, start + dayPageSize)
  }, [safeDayPage, selectedDayBookings])
  const monthBookings = useMemo(() => {
    return sortBookingsByDateTime(bookings.filter((booking) => isSameMonthDate(new Date(booking.date), calendarMonth)))
  }, [bookings, calendarMonth])
  const monthSummary = useMemo(() => {
    return monthBookings.reduce(
      (acc, booking) => {
        acc.total += 1
        if (booking.status === "confirmed") acc.confirmed += 1
        if (booking.status === "pending") acc.pending += 1
        if (booking.status === "cancelled") acc.cancelled += 1
        if (booking.status === "expired") acc.expired += 1
        return acc
      },
      { total: 0, confirmed: 0, pending: 0, cancelled: 0, expired: 0 }
    )
  }, [monthBookings])
  const nextUpcomingBookings = useMemo(() => {
    const now = Date.now()
    return sortBookingsByDateTime(bookings)
      .filter((booking) => new Date(`${bookingDateKey(booking.date)}T${booking.time}:00`).getTime() >= now)
  }, [bookings])
  const upcomingPageSize = 3
  const totalUpcomingPages = Math.max(1, Math.ceil(nextUpcomingBookings.length / upcomingPageSize))
  const safeUpcomingPage = Math.min(upcomingPage, totalUpcomingPages)
  const pagedUpcomingBookings = useMemo(() => {
    const start = (safeUpcomingPage - 1) * upcomingPageSize
    return nextUpcomingBookings.slice(start, start + upcomingPageSize)
  }, [nextUpcomingBookings, safeUpcomingPage])
  const monthLabel = calendarMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
  const activeMeetLink = activeBooking?.googleMeetLink || (activeBooking ? `https://meet.google.com/new#booking-${activeBooking.id}` : null)
  const canOperate = mode === "demo" || mode === "superadmin"
  const compactModalActions = activeBooking?.status === "pending"
  const modalActions = useMemo(() => {
    if (!activeBooking) return []

    const actions: Array<{
      key: CalendarActionType
      label: string
      variant: "default" | "accent" | "destructive"
      icon: typeof Check
      spinnerVariant: "primary" | "accent" | "destructive"
      disabled?: boolean
    }> = []

    if (canOperate && activeBooking.status !== "confirmed" && activeBooking.status !== "expired") {
      actions.push({
        key: "confirm",
        label: activeBooking.status === "cancelled" ? "Reactivar" : "Aceptar",
        variant: "default",
        icon: Check,
        spinnerVariant: "primary",
        disabled: updatingId === activeBooking.id,
      })
    }

    if (canOperate && activeBooking.status !== "cancelled" && activeBooking.status !== "expired") {
      actions.push({
        key: "reschedule",
        label: "Reagendar",
        variant: "accent",
        icon: CalendarCheck2,
        spinnerVariant: "accent",
        disabled: updatingId === activeBooking.id,
      })
      actions.push({
        key: "cancel",
        label: "Cancelar",
        variant: "destructive",
        icon: X,
        spinnerVariant: "destructive",
        disabled: updatingId === activeBooking.id,
      })
    }

    if (activeMeetLink) {
      actions.push({
        key: "meet",
        label: "Abrir Meet",
        variant: "default",
        icon: Video,
        spinnerVariant: "primary",
      })
    }

    return actions
  }, [activeBooking, activeMeetLink, canOperate, updatingId])

  useEffect(() => {
    setDayPage(1)
  }, [selectedKey])

  useEffect(() => {
    if (dayPage > totalDayPages) {
      setDayPage(totalDayPages)
    }
  }, [dayPage, totalDayPages])

  useEffect(() => {
    if (upcomingPage > totalUpcomingPages) {
      setUpcomingPage(totalUpcomingPages)
    }
  }, [totalUpcomingPages, upcomingPage])

  const changeDayPageWithLoader = useCallback((direction: "prev" | "next") => {
    if (dayPageLoading) return
    if (direction === "prev" && safeDayPage <= 1) return
    if (direction === "next" && safeDayPage >= totalDayPages) return
    setDayPageLoading(direction)
    window.setTimeout(() => {
      setDayPage((current) =>
        direction === "prev" ? Math.max(1, current - 1) : Math.min(totalDayPages, current + 1)
      )
      setDayPageLoading(null)
    }, 500)
  }, [dayPageLoading, safeDayPage, totalDayPages])

  const changeUpcomingPageWithLoader = useCallback((direction: "prev" | "next") => {
    if (upcomingPageLoading) return
    if (direction === "prev" && safeUpcomingPage <= 1) return
    if (direction === "next" && safeUpcomingPage >= totalUpcomingPages) return
    setUpcomingPageLoading(direction)
    window.setTimeout(() => {
      setUpcomingPage((current) =>
        direction === "prev" ? Math.max(1, current - 1) : Math.min(totalUpcomingPages, current + 1)
      )
      setUpcomingPageLoading(null)
    }, 500)
  }, [safeUpcomingPage, totalUpcomingPages, upcomingPageLoading])

  const DayButton = useCallback(({ day, modifiers, className, ...props }: DayButtonProps) => {
    const key = dateKey(day.date)
    const counts = bookingStatusCountsByDate[key] ?? { pending: 0, confirmed: 0, cancelled: 0, expired: 0 }
    const badges = [
      counts.confirmed > 0
        ? { label: counts.confirmed, className: "border-primary/40 bg-primary/15 text-primary" }
        : null,
      counts.pending > 0
        ? { label: counts.pending, className: "border-warning/40 bg-warning/15 text-warning" }
        : null,
      counts.cancelled > 0
        ? { label: counts.cancelled, className: "border-secondary/40 bg-secondary/15 text-secondary" }
        : null,
      counts.expired > 0
        ? { label: counts.expired, className: "border-destructive/40 bg-destructive/15 text-destructive" }
        : null,
    ].filter(Boolean) as Array<{ label: number; className: string }>

    return (
      <button {...props} className={className}>
        <span className="flex h-full w-full flex-col items-center justify-between rounded-[inherit] px-1.5 py-1.5">
          <span className={modifiers.outside ? "text-muted-foreground/40" : ""}>{day.date.getDate()}</span>
          {badges.length > 0 ? (
            <span className="flex max-w-full flex-wrap items-center justify-center gap-1">
              {badges.map((badge, index) => (
                <span
                  key={`${key}-badge-${index}`}
                  className={`min-w-4 rounded-full border px-1 py-0.5 text-[9px] font-semibold leading-none ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </span>
          ) : (
            <span className="h-[14px]" aria-hidden="true" />
          )}
        </span>
      </button>
    )
  }, [bookingStatusCountsByDate])

  const updateBookingStatus = useCallback(async (booking: CalendarBooking, status: "confirmed" | "cancelled") => {
    setUpdatingId(booking.id)
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", id: booking.id, status }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error || "No se pudo actualizar la cita")
      }
      await load()
      setActiveBooking((current) => (current?.id === booking.id ? { ...current, status } : current))
      toast({
        title: status === "confirmed" ? "Cita actualizada" : "Cita cancelada",
        description: status === "confirmed" ? "La cita ha quedado confirmada." : "La cita ha quedado cancelada.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "No se pudo actualizar la cita",
        description: error instanceof Error ? error.message : "No se pudo actualizar la cita",
      })
    } finally {
      setUpdatingId(null)
    }
  }, [load, toast])

  const openRescheduleDialog = useCallback((booking: CalendarBooking) => {
    if (!booking.email?.trim()) {
      toast({
        variant: "destructive",
        title: "Correo obligatorio",
        description: "La cita debe tener un correo asociado para poder reagendarla.",
      })
      return
    }
    setActiveBooking(null)
    setRescheduleBooking(booking)
    setRescheduleOpen(true)
  }, [toast])

  const submitReschedule = useCallback(async (payload: BookingWizardSubmitPayload) => {
    if (!rescheduleBooking) {
      throw new Error("Selecciona una cita para reagendar")
    }
    setUpdatingId(rescheduleBooking.id)
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          id: rescheduleBooking.id,
          date: payload.date.toISOString(),
          time: payload.time,
          duration: 30,
        }),
      })
      if (!res.ok) {
        const responsePayload = await res.json().catch(() => null)
        throw new Error(responsePayload?.error || "No se pudo reagendar la cita")
      }
      await load()
      setRescheduleOpen(false)
      setRescheduleBooking(null)
      toast({
        title: "Cita reagendada",
        description: "La cita se ha reagendado correctamente.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo reagendar la cita"
      toast({
        variant: "destructive",
        title: "No se pudo reagendar la cita",
        description: message,
      })
      throw new Error(message)
    } finally {
      setUpdatingId(null)
    }
  }, [load, rescheduleBooking, toast])

  const confirmActionTitle =
    confirmAction === "confirm"
      ? activeBooking?.status === "cancelled"
        ? "Reactivar cita"
        : "Aceptar cita"
      : confirmAction === "cancel"
        ? "Cancelar cita"
        : confirmAction === "reschedule"
          ? "Reagendar cita"
          : confirmAction === "meet"
            ? "Abrir Google Meet"
            : ""

  const confirmActionDescription =
    confirmAction === "confirm"
      ? "Se actualizará el estado de la cita y se notificará según el flujo configurado."
      : confirmAction === "cancel"
        ? "La cita pasará a cancelada."
        : confirmAction === "reschedule"
          ? "Abrirás el flujo para seleccionar una nueva fecha y hora."
          : confirmAction === "meet"
            ? "Se abrirá el enlace de videollamada asociado a esta cita."
            : ""

  const executeConfirmedAction = useCallback(async () => {
    if (!activeBooking || !confirmAction) return

    const action = confirmAction
    setConfirmAction(null)

    if (action === "confirm") {
      await updateBookingStatus(activeBooking, "confirmed")
      return
    }
    if (action === "cancel") {
      await updateBookingStatus(activeBooking, "cancelled")
      return
    }
    if (action === "reschedule") {
      openRescheduleDialog(activeBooking)
      return
    }
    if (action === "meet" && activeMeetLink) {
      window.open(activeMeetLink, "_blank", "noopener,noreferrer")
    }
  }, [activeBooking, activeMeetLink, confirmAction, openRescheduleDialog, updateBookingStatus])

  return (
    <div className="space-y-7">
      <Dialog open={Boolean(confirmAction)} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmActionTitle}</DialogTitle>
            <DialogDescription>{confirmActionDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" className="w-full sm:flex-1" onClick={() => setConfirmAction(null)}>
              Volver
            </Button>
            <Button
              variant={confirmAction === "cancel" ? "destructive" : "default"}
              className="w-full sm:flex-1"
              onClick={executeConfirmedAction}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={rescheduleOpen}
        onOpenChange={(open) => {
          setRescheduleOpen(open)
          if (!open) {
            setRescheduleBooking(null)
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reagendar cita</DialogTitle>
            <DialogDescription>
              Selecciona una nueva fecha y hora. La cita se enviará al correo ya asociado.
            </DialogDescription>
          </DialogHeader>
          {rescheduleBooking && (
            <div className="rounded-xl border border-white/10 bg-background/45 px-4 py-3 text-sm text-muted-foreground">
              Reagendando para{" "}
              <span className="font-medium text-foreground">
                {rescheduleBooking.nombre || rescheduleBooking.email || "cliente sin identificar"}
              </span>
            </div>
          )}
          {rescheduleBooking && (
            <BookingWizard
              className="border-white/10 bg-transparent p-0 shadow-none"
              title="Reagendar cita"
              subtitle="Elige un nuevo día y una nueva hora"
              confirmCtaLabel="Confirmar reagendado"
              confirmingLabel="Reagendando..."
              showDurationSelector={false}
              initialDate={new Date(rescheduleBooking.date)}
              initialTime={rescheduleBooking.time}
              initialDuration={30}
              initialStep="date"
              allowUnavailableSlot={(slot, date) => {
                if (!rescheduleBooking) return false
                return slot === rescheduleBooking.time &&
                  new Date(rescheduleBooking.date).toDateString() === date.toDateString()
              }}
              loadAvailability={async (date) => {
                const res = await fetch(`/api/availability?date=${encodeURIComponent(date.toISOString().slice(0, 10))}`, { cache: "no-store" })
                if (!res.ok) {
                  const payload = await res.json().catch(() => null)
                  throw new Error(payload?.error || "No se pudieron cargar los horarios")
                }
                const data = await res.json()
                return { slots: data.slots || [], unavailable: data.unavailable || [] }
              }}
              onSubmit={submitReschedule}
            />
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(activeBooking)} onOpenChange={(open) => !open && setActiveBooking(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Resumen de la cita</DialogTitle>
            <DialogDescription>
              Detalle operativo de la reserva seleccionada.
            </DialogDescription>
          </DialogHeader>

          {activeBooking && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <div className="text-sm font-semibold">
                    {new Date(activeBooking.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    · {activeBooking.time}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {activeBooking.duration} min · ID {activeBooking.id}
                  </div>
                </div>
                <Badge variant={statusBadgeVariant(activeBooking.status)}>{statusLabel(activeBooking.status)}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-background/45 p-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Cliente</div>
                  <div className="mt-2 text-sm font-medium">
                    {activeBooking.nombre || "Sin nombre"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {activeBooking.clinica || "Sin clínica"}
                  </div>
                  <div className="mt-1 break-all text-xs text-muted-foreground">
                    {activeBooking.email || "Sin email"}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-background/45 p-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Videollamada</div>
                  <div className="mt-2 text-sm font-medium">Google Meet</div>
                  {activeMeetLink ? (
                    <a
                      href={activeMeetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block break-all text-xs text-primary underline-offset-2 hover:underline"
                    >
                      {activeMeetLink}
                    </a>
                  ) : (
                    <div className="mt-2 text-xs text-muted-foreground">Sin enlace disponible</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {modalActions.length > 0 && (
            <DialogFooter
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${modalActions.length}, minmax(0, 1fr))` }}
            >
              {modalActions.map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant}
                  className={`w-full px-3 text-xs sm:text-sm ${compactModalActions ? "gap-0" : "gap-2"}`}
                  disabled={Boolean(action.disabled)}
                  onClick={() => setConfirmAction(action.key)}
                  title={action.label}
                  aria-label={action.label}
                >
                  {action.disabled ? (
                    <Spinner size="sm" variant={action.spinnerVariant} />
                  ) : (
                    <Icon icon={action.icon} size="sm" />
                  )}
                  {!compactModalActions && <span className="truncate">{action.label}</span>}
                </Button>
              ))}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon={CalendarDays} size="sm" variant="primary" />
            <h2 className="text-2xl font-semibold">Calendario</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Agenda mensual de todas las citas con detalle diario.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">{monthLabel}</Badge>
          <Button variant="ghost" size="sm" className="w-auto px-3" asChild>
            <Link href="/admin/bookings">Ir a citas</Link>
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
        <GlassCard className="h-fit min-w-0 self-start p-4 sm:p-5">
          <Calendar
            mode="single"
            month={calendarMonth}
            selected={selectedDate}
            onMonthChange={setCalendarMonth}
            onSelect={(date) => {
              if (!date) return
              setSelectedDate(date)
              setCalendarMonth(date)
            }}
            modifiers={{ booked: bookedDates }}
            className="border-0 bg-transparent p-0 shadow-none"
            classNames={{
              month: "grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-4",
              month_grid: "col-span-3 w-full border-collapse space-y-2",
              weekday: "w-full text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75",
              week: "mt-2 grid grid-cols-7 gap-2",
              day: "h-auto w-auto p-0",
              day_button:
                "h-14 w-full rounded-2xl border border-white/10 bg-white/5 p-0 text-sm font-medium text-foreground shadow-none transition-all hover:border-[rgba(var(--primary-rgb),0.35)] hover:bg-primary/10 hover:text-primary md:h-16",
              selected:
                "[&>button]:border-[rgba(var(--primary-rgb),0.8)] [&>button]:bg-primary/20 [&>button]:text-primary [&>button]:shadow-[0_0_24px_rgba(var(--primary-rgb),0.24)]",
              today: "[&>button]:border-[rgba(var(--accent-rgb),0.45)] [&>button]:bg-accent/10 [&>button]:text-accent",
              outside: "opacity-60",
            }}
            components={{ DayButton }}
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-background/50 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Mes</div>
              <div className="mt-1 text-lg font-semibold">{monthSummary.total}</div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-primary">Confirmadas</div>
              <div className="mt-1 text-lg font-semibold text-primary">{monthSummary.confirmed}</div>
            </div>
            <div className="rounded-xl border border-warning/20 bg-warning/5 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-warning">Pendientes</div>
              <div className="mt-1 text-lg font-semibold text-warning">{monthSummary.pending}</div>
            </div>
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-secondary">Canceladas</div>
              <div className="mt-1 text-lg font-semibold text-secondary">{monthSummary.cancelled}</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="min-w-0 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agenda del día</div>
              <div className="mt-1 text-lg font-semibold">
                {selectedDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <Badge variant={selectedDayBookings.length > 0 ? "primary" : "outline"}>
              {selectedDayBookings.length} cita{selectedDayBookings.length === 1 ? "" : "s"}
            </Badge>
          </div>

          <div className="relative mt-4 space-y-3">
            {loading && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner size="sm" variant="primary" />
                <span>Cargando agenda...</span>
              </div>
            )}
            {!loading && selectedDayBookings.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 bg-background/40 px-4 py-6 text-sm text-muted-foreground">
                No hay citas programadas para este día.
              </div>
            )}
            {!loading && pagedSelectedDayBookings.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => setActiveBooking(booking)}
                className={
                  booking.status === "pending"
                    ? "w-full cursor-pointer rounded-2xl border border-warning/20 bg-warning/5 p-4 text-left transition-all hover:border-warning/40 hover:bg-warning/10"
                    : booking.status === "confirmed"
                      ? "w-full cursor-pointer rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/10"
                      : booking.status === "cancelled"
                        ? "w-full cursor-pointer rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-left transition-all hover:border-secondary/40 hover:bg-secondary/10"
                        : booking.status === "expired"
                          ? "w-full cursor-pointer rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-left transition-all hover:border-destructive/40 hover:bg-destructive/10"
                          : "w-full cursor-pointer rounded-2xl border border-white/10 bg-background/40 p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{booking.time} · {booking.duration} min</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {booking.nombre || booking.clinica || booking.email || "Cita sin contacto asignado"}
                    </div>
                    {(booking.clinica || booking.email) && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {[booking.clinica, booking.email].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                  <Badge variant={statusBadgeVariant(booking.status)}>{statusLabel(booking.status)}</Badge>
                </div>
              </button>
            ))}
            {dayPageLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl border border-white/10 bg-background/55 backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner size="sm" variant="primary" />
                  Cargando citas...
                </div>
              </div>
            )}
          </div>

          {!loading && selectedDayBookings.length > dayPageSize && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="text-xs text-muted-foreground">
                Página {safeDayPage} de {totalDayPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="w-auto"
                  disabled={safeDayPage <= 1 || dayPageLoading !== null}
                  onClick={() => changeDayPageWithLoader("prev")}
                >
                  {dayPageLoading === "prev" ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" variant="primary" />
                      Cargando...
                    </span>
                  ) : "Anterior"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="w-auto"
                  disabled={safeDayPage >= totalDayPages || dayPageLoading !== null}
                  onClick={() => changeDayPageWithLoader("next")}
                >
                  {dayPageLoading === "next" ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" variant="primary" />
                      Cargando...
                    </span>
                  ) : "Siguiente"}
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="min-w-0 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Próximas citas</div>
            <div className="mt-1 text-sm font-semibold">Siguientes pasos de agenda</div>
          </div>
          <Badge variant="accent">
            {nextUpcomingBookings.length} cita{nextUpcomingBookings.length === 1 ? "" : "s"}
          </Badge>
        </div>

        <div className="mt-4 space-y-4">
          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Spinner size="sm" variant="accent" />
              <span>Sincronizando próximos eventos...</span>
            </div>
          )}
          {!loading && nextUpcomingBookings.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 bg-background/40 px-4 py-5 text-sm text-muted-foreground">
              No hay citas futuras registradas.
            </div>
          )}
          {!loading && pagedUpcomingBookings.length > 0 && (
            <div className="relative">
              <div className="grid gap-4 md:grid-cols-3">
                {pagedUpcomingBookings.map((booking, index) => (
                  <div key={booking.id} className="relative">
                    {index < pagedUpcomingBookings.length - 1 && (
                      <div
                        className="absolute left-[calc(50%+1.5rem)] right-[-1rem] top-4 hidden h-px bg-white/10 md:block"
                        aria-hidden="true"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const nextDate = new Date(booking.date)
                        setSelectedDate(nextDate)
                        setCalendarMonth(nextDate)
                        setActiveBooking(booking)
                      }}
                      className="group relative z-10 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-background/45 p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="absolute left-6 top-14 bottom-6 w-px bg-white/10 group-last:hidden md:hidden" aria-hidden="true" />
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                          {(safeUpcomingPage - 1) * upcomingPageSize + index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">
                                {new Date(booking.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {booking.time}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {booking.nombre || booking.clinica || booking.email || "Sin contacto"}
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground">
                                {booking.duration} min
                              </div>
                            </div>
                            <Badge variant={statusBadgeVariant(booking.status)}>{statusLabel(booking.status)}</Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              {upcomingPageLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl border border-white/10 bg-background/55 backdrop-blur-sm">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner size="sm" variant="accent" />
                    Cargando próximas citas...
                  </div>
                </div>
              )}
            </div>
          )}
          {!loading && nextUpcomingBookings.length > upcomingPageSize && (
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="text-xs text-muted-foreground">
                Página {safeUpcomingPage} de {totalUpcomingPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="w-auto"
                  disabled={safeUpcomingPage <= 1 || upcomingPageLoading !== null}
                  onClick={() => changeUpcomingPageWithLoader("prev")}
                >
                  {upcomingPageLoading === "prev" ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" variant="accent" />
                      Cargando...
                    </span>
                  ) : "Anterior"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="w-auto"
                  disabled={safeUpcomingPage >= totalUpcomingPages || upcomingPageLoading !== null}
                  onClick={() => changeUpcomingPageWithLoader("next")}
                >
                  {upcomingPageLoading === "next" ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" variant="accent" />
                      Cargando...
                    </span>
                  ) : "Siguiente"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
