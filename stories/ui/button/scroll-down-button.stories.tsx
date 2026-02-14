import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollDownButton } from "@/components/ui/scroll-down-button";

const meta = {
  title: "UI/Button/ScrollDownButton",
  component: ScrollDownButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollDownButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-10">
      <ScrollDownButton />
    </div>
  ),
};

export const OverHero: Story = {
  render: () => (
    <div className="relative h-[420px] w-[min(900px,100%)] overflow-hidden rounded-xl border bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="relative z-10 p-8">
        <div className="text-2xl font-semibold tracking-tight">Hero</div>
        <div className="mt-2 text-muted-foreground">Place it centered at the bottom of the hero.</div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <ScrollDownButton aria-label="Scroll down" />
      </div>
    </div>
  ),
};
