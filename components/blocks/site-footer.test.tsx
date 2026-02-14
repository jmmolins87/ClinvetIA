import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SiteFooter } from "@/components/blocks/site-footer";

describe("SiteFooter", () => {
  it("renders footer links and CTA", () => {
    render(<SiteFooter />);

    expect(screen.getByText("Producto")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    expect(screen.getByText("Empieza hoy")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "ROI" })).toHaveAttribute("href", "/roi");
    expect(screen.getByRole("link", { name: /Reservar demo/i })).toHaveAttribute(
      "href",
      "/reservar"
    );
  });

  it("scrolls to top when logo clicked", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(window, "scrollTo");
    render(<SiteFooter />);

    await user.click(screen.getByRole("button", { name: "Ir arriba" }));
    expect(spy).toHaveBeenCalled();
  });
});
