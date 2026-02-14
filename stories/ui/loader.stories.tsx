import type { Meta, StoryObj } from "@storybook/react";

import { Loader } from "@/components/loader";

const meta = {
  title: "UI/Loader",
  component: Loader,
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[520px] w-full">
      <Loader />
    </div>
  ),
};
