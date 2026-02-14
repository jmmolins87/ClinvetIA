import * as React from "react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { cn } from "@/lib/utils";

type LucideIconsMap = typeof LucideIcons;

export type IconName = {
  [K in keyof LucideIconsMap]: LucideIconsMap[K] extends LucideIcon ? K : never;
}[keyof LucideIconsMap];

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  "aria-label"?: string;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
  "aria-label": ariaLabel,
  ...props
}: IconProps) {
  const IconComponent = (LucideIcons[name] as unknown as LucideIcon | undefined);

  if (!IconComponent) return null;

  return (
    <IconComponent
      className={cn("shrink-0", className)}
      size={size}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      {...props}
    />
  );
}
