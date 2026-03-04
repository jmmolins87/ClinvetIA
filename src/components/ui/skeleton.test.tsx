import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper"

describe("Skeleton", () => {
  it("renders single line by default", () => {
    const { container } = render(<Skeleton data-testid="single" />)

    expect(screen.getByTestId("single")).toBeInTheDocument()
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(1)
  })

  it("renders text skeleton with multiple lines and shorter last line", () => {
    const { container } = render(<Skeleton shape="text" lines={3} variant="secondary" />)

    const lines = container.querySelectorAll(".animate-pulse")
    expect(lines).toHaveLength(3)
    expect(lines[2]).toHaveClass("w-2/3")
  })

  it("renders circle shape correctly", () => {
    render(<Skeleton shape="circle" data-testid="circle" />)
    expect(screen.getByTestId("circle")).toHaveClass("rounded-full")
  })
})

describe("SkeletonWrapper", () => {
  it("shows children and hides skeleton when showSkeleton is false", () => {
    const { container } = render(
      <SkeletonWrapper showSkeleton={false}>
        <span>Contenido real</span>
      </SkeletonWrapper>
    )

    expect(screen.getByText("Contenido real")).toBeInTheDocument()
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(0)
  })

  it("shows skeleton when showSkeleton is true", () => {
    const { container } = render(
      <SkeletonWrapper showSkeleton variant="glass">
        <span>Contenido real</span>
      </SkeletonWrapper>
    )

    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(1)
  })

  it("supports span wrapper mode", () => {
    const { container } = render(
      <SkeletonWrapper as="span" showSkeleton={false}>
        <span>Span content</span>
      </SkeletonWrapper>
    )

    const root = container.firstElementChild
    expect(root?.tagName).toBe("SPAN")
    expect(root).toHaveClass("inline-grid")
  })
})
