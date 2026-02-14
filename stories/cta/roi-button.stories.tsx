import type { Meta, StoryObj } from "@storybook/react-vite";

import { RoiButton } from "../../components/cta/roi-button";

const meta = {
  title: "CTA/RoiButton",
  component: RoiButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Boton CTA para ROI. Encapsula estilos legacy (primary + glow en dark). Usalo con `asChild` para enlaces.",
      },
    },
  },
} satisfies Meta<typeof RoiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <RoiButton>ROI</RoiButton>,
  parameters: {
    codegen: () => `import Link from "next/link";
import { RoiButton } from "@/components/cta/roi-button";

export function HeaderCta() {
  return (
    <RoiButton asChild>
      <Link href="/roi">ROI</Link>
    </RoiButton>
  );
}`,
  },
};
