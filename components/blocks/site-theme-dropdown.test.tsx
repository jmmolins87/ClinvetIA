import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SiteThemeDropdown", () => {
  it("renders trigger button", async () => {
    vi.resetModules();
    vi.doMock("next-themes", () => {
      return {
        useTheme: () => ({ theme: "system", setTheme: vi.fn() }),
      };
    });

    const mod = await import("@/components/blocks/site-theme-dropdown");
    render(<mod.SiteThemeDropdown />);
    expect(await screen.findByRole("button", { name: "Cambiar tema" })).toBeInTheDocument();
  });

  it("opens menu and allows selecting theme", async () => {
    const user = userEvent.setup();

    const setTheme = vi.fn();
    vi.resetModules();
    vi.doMock("next-themes", () => ({
      useTheme: () => ({ theme: "system", setTheme }),
    }));

    const mod = await import("@/components/blocks/site-theme-dropdown");
    render(<mod.SiteThemeDropdown />);

    await user.click(screen.getByRole("button", { name: "Cambiar tema" }));
    await user.click(screen.getByText("Claro"));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("supports size=large", async () => {
    vi.resetModules();
    vi.doMock("next-themes", () => {
      return {
        useTheme: () => ({ theme: "system", setTheme: vi.fn() }),
      };
    });

    const mod = await import("@/components/blocks/site-theme-dropdown");
    render(<mod.SiteThemeDropdown size="large" />);
    expect(await screen.findByRole("button", { name: "Cambiar tema" })).toBeInTheDocument();
  });
});
