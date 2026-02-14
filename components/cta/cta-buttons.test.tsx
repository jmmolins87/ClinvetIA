import { render, screen } from "@testing-library/react";

import { DemoButton } from "@/components/cta/demo-button";
import { RoiButton } from "@/components/cta/roi-button";

describe("CTA buttons", () => {
  it("DemoButton renders", () => {
    render(<DemoButton>Demo</DemoButton>);
    expect(screen.getByRole("button", { name: "Demo" })).toBeInTheDocument();
  });

  it("RoiButton renders", () => {
    render(<RoiButton>ROI</RoiButton>);
    expect(screen.getByRole("button", { name: "ROI" })).toBeInTheDocument();
  });
});
