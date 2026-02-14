import type { Meta, StoryObj } from "@storybook/react-vite";

import { DemoButton } from "../../components/cta/demo-button";

const meta = {
  title: "CTA/DemoButton",
  component: DemoButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Boton CTA para Demo. Encapsula estilos legacy (outline + altura 48px). Usalo con `asChild` para enlaces o como button normal.",
      },
    },
  },
} satisfies Meta<typeof DemoButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DemoButton>Reservar demo</DemoButton>,
  parameters: {
    codegen: () => `import Link from "next/link";
import { DemoButton } from "@/components/cta/demo-button";

export function HeaderCta() {
  return (
    <DemoButton asChild>
      <Link href="/reservar">Reservar demo</Link>
    </DemoButton>
  );
}`,
  },
};
