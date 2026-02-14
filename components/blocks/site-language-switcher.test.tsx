import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SiteLanguageSwitcher } from "@/components/blocks/site-language-switcher";

describe("SiteLanguageSwitcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "es";
  });

  it("renders ES/EN labels and toggles language", async () => {
    const user = userEvent.setup();

    render(<SiteLanguageSwitcher defaultLanguage="es" />);

    expect(screen.getByText("ES")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();

    const sw = screen.getByRole("switch", { name: "Cambiar idioma" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(document.documentElement.lang).toBe("es");

    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(window.localStorage.getItem("clinvetia.lang")).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("loads language from localStorage", () => {
    window.localStorage.setItem("clinvetia.lang", "en");
    render(<SiteLanguageSwitcher defaultLanguage="es" />);

    const sw = screen.getByRole("switch", { name: "Cambiar idioma" });
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SiteLanguageSwitcher defaultLanguage="es" onChange={onChange} />);

    await user.click(screen.getByRole("switch", { name: "Cambiar idioma" }));
    expect(onChange).toHaveBeenCalledWith("en");
  });
});
