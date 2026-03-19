"use client"

import * as React from "react"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = false, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      weekStartsOn={1}
      navLayout="around"
      showOutsideDays={showOutsideDays}
      className={cn("rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[var(--glass-highlight)]", className)}
      classNames={{
        root: "w-full",
        months: "flex flex-col gap-4",
        month: "grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-3",
        month_caption: "col-start-2 flex h-8 items-center justify-center",
        caption_label: "text-sm font-semibold text-foreground capitalize",
        nav: "hidden",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "col-start-1 row-start-1 !inline-flex !h-8 !w-8 rounded-full border border-white/20 bg-white/12 p-0 text-white/90 hover:bg-white/22 hover:text-white"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "col-start-3 row-start-1 !inline-flex !h-8 !w-8 rounded-full border border-white/20 bg-white/12 p-0 text-white/90 hover:bg-white/22 hover:text-white"
        ),
        month_grid: "col-span-3 w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "w-9 text-[0.72rem] font-medium text-muted-foreground/90",
        week: "mt-1 flex w-full",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 cursor-pointer rounded-full border border-white/15 bg-white/10 p-0 text-sm font-medium text-foreground shadow-none",
          "hover:border-[rgba(var(--primary-rgb),0.45)] hover:bg-primary/15 hover:text-primary",
          "focus-visible:ring-1 focus-visible:ring-primary"
        ),
        selected: "[&>button]:border-[rgba(var(--primary-rgb),0.75)] [&>button]:bg-primary/25 [&>button]:text-primary [&>button]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.25)]",
        today: "[&>button]:border-[rgba(var(--primary-rgb),0.45)] [&>button]:bg-primary/10 [&>button]:text-primary",
        outside: "text-muted-foreground/45",
        disabled: "cursor-not-allowed text-muted-foreground/35",
        range_middle: "bg-primary/10 text-primary",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className }) =>
          orientation === "left" ? (
            <Icon icon={ChevronLeft} size="sm" variant="foreground" className={cn("text-white/95", className)} />
          ) : (
            <Icon icon={ChevronRight} size="sm" variant="foreground" className={cn("text-white/95", className)} />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
