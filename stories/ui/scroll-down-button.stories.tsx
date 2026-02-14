import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollDownButton } from "../../components/ui/scroll-down-button";

const meta = {
  title: "UI/ScrollDownButton",
  component: ScrollDownButton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollDownButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center py-10">
      <ScrollDownButton aria-label="Scroll down" />
    </div>
  ),
};

export const WithTarget: Story = {
  render: () => (
    <div className="min-h-[60vh]">
      <div className="h-[40vh] p-6 text-sm text-muted-foreground">
        Click to scroll to target.
      </div>
      <div className="flex items-center justify-center py-6">
        <ScrollDownButton aria-label="Scroll to target" targetId="target" />
      </div>
      <div id="target" className="h-[40vh] rounded-xl border bg-card p-6">
        Target
      </div>
    </div>
  ),
};
