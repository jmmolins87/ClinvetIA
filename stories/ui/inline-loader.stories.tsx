import type { Meta, StoryObj } from "@storybook/react";

import { InlineLoader } from "@/components/inline-loader";

const meta = {
  title: "UI/InlineLoader",
  component: InlineLoader,
  tags: ["autodocs"],
} satisfies Meta<typeof InlineLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <InlineLoader />,
};
