import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PrintBanner from "./PrintBanner";
import Header from "./Header";
import LangState from "../../context/lang";

describe("PrintBanner", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("shows the banner by default", () => {
    render(<PrintBanner width="100%" height="200px" className="Form-Banner header" />);
    expect(screen.getByAltText("Banner")).not.toHaveStyle({ visibility: "hidden" });
  });

  test("hides the banner but keeps its space when the setting is off", () => {
    localStorage.setItem("printWithBanner", "false");
    render(<PrintBanner width="100%" height="200px" className="Form-Banner header" />);
    const banner = screen.getByAltText("Banner");
    expect(banner).toHaveStyle({ visibility: "hidden" });
    // The image element stays in the layout so letterhead alignment is kept.
    expect(banner).toHaveAttribute("height", "200px");
  });

  test("shows the banner again when the setting is turned back on", () => {
    localStorage.setItem("printWithBanner", "true");
    render(<PrintBanner className="Form-Banner-compatibility-modal" />);
    expect(screen.getByAltText("Banner")).not.toHaveStyle({ visibility: "hidden" });
  });
});

describe("Header print-banner toggle", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("persists the choice to localStorage when toggled", () => {
    render(
      <LangState>
        <Header translate={(key: string) => key} />
      </LangState>
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(localStorage.getItem("printWithBanner")).toBe("false");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(localStorage.getItem("printWithBanner")).toBe("true");
    expect(checkbox).toBeChecked();
  });
});
