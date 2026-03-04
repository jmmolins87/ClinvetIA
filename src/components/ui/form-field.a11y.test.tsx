import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getA11yViolations } from "@/test/axe"

describe("Form field accessibility", () => {
  it("has no basic a11y violations when label is associated", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="clinica">Nombre de la clínica</Label>
        <Input id="clinica" name="clinica" />
      </div>
    )

    expect(screen.getByLabelText(/nombre de la clínica/i)).toBeInTheDocument()

    const violations = await getA11yViolations(container)
    expect(violations).toHaveLength(0)
  })
})
