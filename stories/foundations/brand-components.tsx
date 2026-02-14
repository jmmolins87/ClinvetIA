import * as React from "react";

import { cn } from "@/lib/utils";

type ColorToken = {
  label: string;
  value: string;
  type?: "color" | "gradient";
};

function ColorSwatch({ token }: { token: ColorToken }): JSX.Element {
  const isGradient = token.type === "gradient";

  return (
    <div className="grid grid-cols-[1fr,140px] items-center gap-4 rounded-lg border bg-card p-3">
      <div className="min-w-0">
        <div className="font-mono text-xs text-muted-foreground">{token.label}</div>
        <div className="mt-1 truncate font-mono text-xs">{token.value}</div>
      </div>
      <div
        className="h-10 w-full rounded-md border"
        style={
          isGradient
            ? {
                background: token.value,
              }
            : {
                backgroundColor: token.value,
              }
        }
      />
    </div>
  );
}

function TokenGrid({ tokens }: { tokens: ColorToken[] }): JSX.Element {
  return (
    <div className="grid gap-3">
      {tokens.map((t) => (
        <ColorSwatch key={t.label} token={t} />
      ))}
    </div>
  );
}

function ThemePanel({
  title,
  themeClassName,
  children,
}: {
  title: string;
  themeClassName?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section
      className={cn(
        "rounded-xl border bg-background text-foreground",
        themeClassName
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {themeClassName ? themeClassName : "(default)"}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function BrandPalette(): JSX.Element {
  const baseTokens: ColorToken[] = [
    { label: "--background", value: "var(--background)" },
    { label: "--foreground", value: "var(--foreground)" },
    { label: "--card", value: "var(--card)" },
    { label: "--card-foreground", value: "var(--card-foreground)" },
    { label: "--popover", value: "var(--popover)" },
    { label: "--popover-foreground", value: "var(--popover-foreground)" },
    { label: "--muted", value: "var(--muted)" },
    { label: "--muted-foreground", value: "var(--muted-foreground)" },
    { label: "--border", value: "var(--border)" },
    { label: "--input", value: "var(--input)" },
    { label: "--ring", value: "var(--ring)" },
  ];

  const accentTokens: ColorToken[] = [
    { label: "--primary", value: "var(--primary)" },
    { label: "--primary-foreground", value: "var(--primary-foreground)" },
    { label: "--secondary", value: "var(--secondary)" },
    { label: "--secondary-foreground", value: "var(--secondary-foreground)" },
    { label: "--accent", value: "var(--accent)" },
    { label: "--accent-foreground", value: "var(--accent-foreground)" },
    { label: "--destructive", value: "var(--destructive)" },
    { label: "--destructive-foreground", value: "var(--destructive-foreground)" },
  ];

  const fxTokens: ColorToken[] = [
    { label: "--glow", value: "var(--glow)" },
    {
      label: "gradient (from/to)",
      value: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
      type: "gradient",
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 md:grid-cols-2">
        <ThemePanel title="Light" themeClassName="">
          <div className="grid gap-5">
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Base</div>
              <TokenGrid tokens={baseTokens} />
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Accents</div>
              <TokenGrid tokens={accentTokens} />
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">FX</div>
              <TokenGrid tokens={fxTokens} />
            </div>
          </div>
        </ThemePanel>

        <ThemePanel title="Dark" themeClassName="dark">
          <div className="grid gap-5">
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Base</div>
              <TokenGrid tokens={baseTokens} />
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Accents</div>
              <TokenGrid tokens={accentTokens} />
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">FX</div>
              <TokenGrid tokens={fxTokens} />
            </div>
          </div>
        </ThemePanel>
      </div>
    </div>
  );
}

export function BrandTypography(): JSX.Element {
  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="text-xs font-medium text-muted-foreground">Font Sans</div>
        <div className="mt-4 grid gap-4 font-sans">
          <div className="text-3xl font-semibold tracking-tight">Clinteia Typography</div>
          <div className="text-lg text-muted-foreground">
            Body text uses Geist Sans via the CSS variable --font-geist-sans and the Tailwind token font-sans.
          </div>
          <div className="grid gap-2">
            <div className="text-sm">
              The quick brown fox jumps over the lazy dog. 0123456789
            </div>
            <div className="text-sm text-muted-foreground">
              Links and emphasis should stay readable over neon backgrounds.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="text-xs font-medium text-muted-foreground">Font Mono</div>
        <div className="mt-4 grid gap-3 font-mono">
          <div className="text-sm">const theme = {"\"dark\""};</div>
          <div className="text-sm text-muted-foreground">
            Mono text uses Geist Mono via the CSS variable --font-geist-mono and the Tailwind token font-mono.
          </div>
        </div>
      </div>
    </div>
  );
}
