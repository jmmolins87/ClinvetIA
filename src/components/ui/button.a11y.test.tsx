import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "@/components/ui/button"
import { getA11yViolations } from "@/test/axe"

describe("Button accessibility", () => {
  it("has no basic a11y violations", async () => {
    const { container } = render(<Button>Reservar demo</Button>)

    expect(screen.getByRole("button", { name: /reservar demo/i })).toBeInTheDocument()

    const violations = await getA11yViolations(container)
    expect(violations).toHaveLength(0)
  })
})
