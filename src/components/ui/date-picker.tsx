"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Icon } from "@/components/ui/icon"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DatePickerProps {
  value?: DateRange
  onChange: (value: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function formatRange(value?: DateRange) {
  if (!value?.from) return null
  if (!value.to) return format(value.from, "PPP", { locale: es })
  return `${format(value.from, "dd MMM yyyy", { locale: es })} - ${format(value.to, "dd MMM yyyy", { locale: es })}`
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className,
  disabled,
}: DatePickerProps) {
  const label = formatRange(value) ?? placeholder
  const hasValue = Boolean(value?.from)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 w-full justify-between rounded-full border-[var(--field-border)] bg-[var(--field-bg)] px-4 text-left font-normal text-foreground",
            "hover:border-[var(--field-border-hover)] hover:bg-[var(--field-bg-hover)]",
            "focus-visible:border-[var(--field-focus-border)] focus-visible:shadow-[var(--field-focus-shadow)]",
            !hasValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">{label}</span>
          <Icon icon={CalendarIcon} size="sm" variant={hasValue ? "primary" : "muted"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={1} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
