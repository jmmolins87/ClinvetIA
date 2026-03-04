import axe from "axe-core"

export async function getA11yViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // JSDOM no calcula layout real de color de forma fiable.
      "color-contrast": { enabled: false },
    },
  })

  return results.violations
}
