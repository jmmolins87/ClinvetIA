"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type ThemeValue = "light" | "dark" | "system";

export function SiteThemeDropdown({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  const { theme, setTheme } = useTheme();
  const current = (theme ?? "system") as ThemeValue;
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const icon = React.useMemo(() => {
    const iconSize = size === "large" ? "w-8 h-8" : "h-6 w-6";
    if (current === "dark") return <Icon name="Moon" className={iconSize} />;
    if (current === "light") return <Icon name="Sun" className={iconSize} />;
    return <Icon name="Monitor" className={iconSize} />;
  }, [current, size]);

  if (!mounted) {
    if (size === "large") {
      return (
        <div className="flex items-center justify-center p-2 rounded-lg bg-transparent opacity-50">
          <Icon name="Sun" className="w-8 h-8" />
        </div>
      );
    }

    return (
      <Button
        variant="ghost"
        className={cn("h-12 w-12 flex items-center justify-center", className)}
        aria-label="Cambiar tema"
        disabled
      >
        <Icon name="Sun" className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {size === "large" ? (
          <button
            type="button"
            className={cn(
              "flex items-center justify-center p-4 rounded-lg cursor-pointer transition-colors hover:bg-gradient-to/10 hover:text-gradient-to dark:hover:bg-primary/10 dark:hover:text-primary",
              isOpen ? "bg-primary/10 text-primary" : "",
              className
            )}
            aria-label="Cambiar tema"
          >
            {icon}
          </button>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "h-12 w-12 flex items-center justify-center cursor-pointer transition-colors",
              className
            )}
            aria-label="Cambiar tema"
          >
            {icon}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="center"
        className="min-w-[120px] origin-bottom fan-open"
      >
        <DropdownMenuItem
          onSelect={() => setTheme("light")}
          className="cursor-pointer flex flex-col items-center justify-center py-4 relative"
        >
          <Icon name="Sun" className="h-7 w-7 mb-2" />
          <span className="text-sm font-medium">Claro</span>
          {current === "light" && (
            <span className="absolute top-2 right-2 text-gradient-to dark:text-primary text-sm">
              ✓
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setTheme("dark")}
          className="cursor-pointer flex flex-col items-center justify-center py-4 relative"
        >
          <Icon name="Moon" className="h-7 w-7 mb-2" />
          <span className="text-sm font-medium">Oscuro</span>
          {current === "dark" && (
            <span className="absolute top-2 right-2 text-gradient-to dark:text-primary text-sm">
              ✓
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setTheme("system")}
          className="cursor-pointer flex flex-col items-center justify-center py-4 relative"
        >
          <Icon name="Monitor" className="h-7 w-7 mb-2" />
          <span className="text-sm font-medium">Sistema</span>
          {current === "system" && (
            <span className="absolute top-2 right-2 text-gradient-to dark:text-primary text-sm">
              ✓
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
