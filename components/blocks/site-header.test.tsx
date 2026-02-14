import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function mockNavigation(pathname: string) {
  vi.resetModules();
  vi.doMock("next/navigation", () => {
    return {
      usePathname: () => pathname,
      useSearchParams: () => new URLSearchParams(),
      useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
      }),
    };
  });
}

describe("SiteHeader", () => {
  it("renders nav links", async () => {
    mockNavigation("/solucion");
    const mod = await import("@/components/blocks/site-header");

    render(<mod.SiteHeader />);
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solucion" })).toHaveAttribute("href", "/solucion");
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/contacto");
  });

  it("opens and closes mobile menu", async () => {
    const user = userEvent.setup();
    mockNavigation("/");
    const mod = await import("@/components/blocks/site-header");
    render(<mod.SiteHeader />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(screen.getAllByRole("link", { name: "Solucion" }).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Cerrar menu" }));
    // Dialog content is removed; ensure close button is gone
    expect(screen.queryByRole("button", { name: "Cerrar menu" })).not.toBeInTheDocument();
  });

  it("home logo click scrolls to top", async () => {
    const user = userEvent.setup();
    mockNavigation("/");
    const mod = await import("@/components/blocks/site-header");

    const scrollSpy = vi.spyOn(window, "scrollTo");
    render(<mod.SiteHeader />);
    await user.click(screen.getByRole("button", { name: "Ir arriba" }));
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("mobile menu logo click navigates to home when not on home", async () => {
    const user = userEvent.setup();

    vi.resetModules();
    const push = vi.fn();
    vi.doMock("next/navigation", () => {
      return {
        usePathname: () => "/contacto",
        useSearchParams: () => new URLSearchParams(),
        useRouter: () => ({
          push,
          replace: vi.fn(),
          back: vi.fn(),
          forward: vi.fn(),
          refresh: vi.fn(),
        }),
      };
    });

    const mod = await import("@/components/blocks/site-header");
    render(<mod.SiteHeader />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(screen.getByRole("button", { name: "Ir arriba" }));
    expect(push).toHaveBeenCalledWith("/");
  });
});
