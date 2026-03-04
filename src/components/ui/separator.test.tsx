import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Separator } from "@/components/ui/separator"

describe("Separator", () => {
  it("renders horizontal separator by default", () => {
    render(<Separator data-testid="separator" />)

    const separator = screen.getByTestId("separator")
    expect(separator).toHaveAttribute("data-orientation", "horizontal")
    expect(separator).toHaveClass("h-[1px]")
  })

  it("renders vertical separator when requested", () => {
    render(<Separator data-testid="separator" orientation="vertical" />)

    const separator = screen.getByTestId("separator")
    expect(separator).toHaveAttribute("data-orientation", "vertical")
    expect(separator).toHaveClass("w-[1px]")
  })
})
