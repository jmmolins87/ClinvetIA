import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DemoButton({
  variant = "outline",
  size = "lg",
  className,
  ...props
}: React.ComponentProps<typeof Button>): React.JSX.Element {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "h-12 box-border cursor-pointer border-2 bg-sky-50 text-black hover:bg-sky-100 dark:bg-black dark:text-white dark:hover:bg-neutral-900",
        className
      )}
      {...props}
    />
  );
}
