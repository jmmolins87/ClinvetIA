import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges tailwind classes and keeps the last conflicting value", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("ignores falsy values", () => {
    expect(cn("text-sm", false && "hidden", undefined, null, "font-medium")).toBe(
      "text-sm font-medium"
    )
  })
})
