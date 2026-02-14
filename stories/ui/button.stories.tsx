import type { Meta, StoryObj } from "@storybook/react";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button>Button</Button>,
};

export const Secondary: Story = {
  render: () => <Button variant="secondary">Secondary</Button>,
};

export const Destructive: Story = {
  render: () => <Button variant="destructive">Destructive</Button>,
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Mail className="size-4" />
      Email
    </Button>
  ),
};

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="size-4 animate-spin" />
      Loading
    </Button>
  ),
};

export const Disabled: Story = {
  render: () => <Button disabled>Disabled</Button>,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="default">Default</Button>
      <Button size="lg">LG</Button>
      <Button size="icon" aria-label="Icon">
        <Mail className="size-4" />
      </Button>
      <Button size="icon-sm" aria-label="Icon sm">
        <Mail className="size-4" />
      </Button>
      <Button size="icon-lg" aria-label="Icon lg">
        <Mail className="size-4" />
      </Button>
    </div>
  ),
};

export const AsChildLink: Story = {
  render: () => (
    <Button asChild>
      <a href="#" onClick={(e) => e.preventDefault()}>
        Anchor as Button
      </a>
    </Button>
  ),
};
