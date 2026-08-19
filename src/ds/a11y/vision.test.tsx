import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../test/axe";
import { VisionProvider } from "./VisionProvider";
import { VisionToggle } from "./VisionToggle";

const renderToggle = () =>
  render(
    <VisionProvider>
      <VisionToggle />
    </VisionProvider>,
  );

afterEach(() => {
  delete document.documentElement.dataset["vision"];
});

describe("vision simulation", () => {
  it("has no axe violations", async () => {
    const { container } = renderToggle();

    await expectNoAxeViolations(container);
  });

  it("names the group, because four loose chips are not a question", async () => {
    renderToggle();

    expect(screen.getByRole("group", { name: /simulate colour vision deficiency/i })).toBeInTheDocument();
  });

  it("appends the prevalence to the label instead of replacing it", () => {
    renderToggle();

    // SC 2.5.3: someone using voice control says the word they can read, so the
    // visible label has to lead the accessible name.
    const deutan = screen.getByRole("button", { name: "Deutan, 1 in 16 men" });

    expect(deutan).toHaveTextContent("Deutan");
  });

  it("costs nothing until something is selected", () => {
    renderToggle();

    expect(document.documentElement.dataset["vision"]).toBeUndefined();
  });

  it("puts the chosen deficiency on the root element", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /^Protan/ }));

    expect(document.documentElement.dataset["vision"]).toBe("protanopia");
  });

  it("is exclusive: choosing one releases the last", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /^Protan/ }));
    await user.click(screen.getByRole("button", { name: /^Tritan/ }));

    expect(document.documentElement.dataset["vision"]).toBe("tritanopia");
    expect(screen.getByRole("button", { name: /^Protan/ })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /^Tritan/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("returns to normal vision", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /^Deutan/ }));
    await user.click(screen.getByRole("button", { name: "Normal" }));

    expect(document.documentElement.dataset["vision"]).toBeUndefined();
  });

  it("declares the filters in linear light", () => {
    const { container } = renderToggle();

    // The matrices are defined on linear RGB and feColorMatrix defaults to sRGB.
    // Getting this wrong produces a picture that looks plausible and is not the
    // simulation, which is worse than not simulating at all.
    const filters = container.querySelectorAll("filter");

    expect(filters).toHaveLength(3);
    for (const filter of filters) {
      expect(filter.getAttribute("color-interpolation-filters")).toBe("linearRGB");
    }
  });
});
