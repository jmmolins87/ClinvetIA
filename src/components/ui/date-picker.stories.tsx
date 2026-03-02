import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Design System/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    value: undefined,
    onChange: () => undefined,
  },
  parameters: {},
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

function EmptyDatePickerStory() {
  const [value, setValue] = useState<DateRange | undefined>(undefined)
  return (
    <div className="w-80 space-y-2">
      <Label className="text-sm font-medium">Intervalo</Label>
      <DatePicker value={value} onChange={setValue} />
    </div>
  )
}

function DatePickerWithValueStory() {
  const start = new Date(2026, 2, 2)
  const end = new Date(2026, 2, 6)
  const [value, setValue] = useState<DateRange | undefined>({
    from: start,
    to: end,
  })
  return (
    <div className="w-80 space-y-2">
      <Label className="text-sm font-medium">Intervalo</Label>
      <DatePicker value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: () => <EmptyDatePickerStory />,
}

export const WithValue: Story = {
  render: () => <DatePickerWithValueStory />,
}

export const DarkAndLight: Story = {
  globals: { theme: "side-by-side" },
  render: () => <EmptyDatePickerStory />,
}
