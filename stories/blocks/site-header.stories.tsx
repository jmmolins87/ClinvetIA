import type { Meta, StoryObj } from "@storybook/react-vite";

import * as React from "react";

import { SiteHeader } from "../../components/blocks/site-header";

const meta = {
  title: "Block Components/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Header de sitio (bloque) con navegacion, CTAs, switch de idioma, theme toggle y menu mobile tipo Sheet. Incluye indicador animado de link activo y estados de scroll.",
      },
    },
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-screen-2xl px-4 py-10 text-sm text-muted-foreground">
        Scroll para ver el estado scrolled.
      </div>
    </div>
  ),
};
Default.parameters = {
  codegen: () => `import { SiteHeader } from "@/components/blocks/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}`,
};

function ScrolledHarness() {
  React.useEffect(() => {
    window.scrollTo({ top: 420, behavior: "auto" });
  }, []);

  return (
    <div className="bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-screen-2xl px-4 py-10 text-sm text-muted-foreground">
        Forzado a scroll ~420px.
      </div>
    </div>
  );
}

export const Scrolled: Story = {
  render: () => <ScrolledHarness />,
};
