import type { Meta, StoryObj } from "@storybook/react-vite";

import { HeroDnaBackground } from "../../components/blocks/hero-dna-background";

const meta = {
  title: "Block components/HeroDnaBackground",
  component: HeroDnaBackground,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroDnaBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative h-dvh w-full bg-background">
      <HeroDnaBackground />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="text-3xl font-semibold tracking-tight">DNA background</div>
        <div className="mt-2 text-muted-foreground">Procedural p5 canvas (reduced motion safe).</div>
      </div>
    </div>
  ),
};
