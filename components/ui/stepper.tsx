import * as React from "react";

import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export type StepperStep = {
  key: string;
  icon: IconName;
  title: string;
  description?: string;
};

export function Stepper({
  steps,
  className,
  variant = "default",
}: {
  steps: StepperStep[];
  className?: string;
  variant?: "default" | "cards";
}): React.JSX.Element {
  return (
    <ol
      className={cn(
        "grid gap-4 md:grid-cols-4 md:gap-6",
        variant === "cards" && "md:items-stretch",
        className
      )}
    >
      {steps.map((step, idx) => (
        <li
          key={step.key}
          className={cn(
            "relative",
            variant === "cards"
              ? "rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6"
              : "pt-1"
          )}
        >
          {variant === "default" ? (
            <div className="flex gap-4">
              <div className="relative shrink-0">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                  <Icon name={step.icon} size={22} aria-label={step.title} />
                </div>
                {idx < steps.length - 1 ? (
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-12 hidden h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-border md:block"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-muted-foreground">{idx + 1}</div>
                <div className="mt-1 text-lg font-semibold leading-tight">{step.title}</div>
                {step.description ? (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-gradient-from to-gradient-to text-primary-foreground shadow-sm dark:glow-sm">
                <Icon name={step.icon} size={22} aria-label={step.title} />
              </div>
              <div className="mt-4 text-xs font-semibold text-muted-foreground">
                {idx + 1}
              </div>
              <div className="mt-1 text-base font-semibold leading-tight">{step.title}</div>
              {step.description ? (
                <div className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </div>
              ) : null}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
