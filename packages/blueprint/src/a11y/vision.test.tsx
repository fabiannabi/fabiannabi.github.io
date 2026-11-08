import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../test/axe";
import { VisionProvider } from "./VisionProvider";
import { useVision } from "./useVision";
import type { Vision } from "./VisionContext";
import { VisionToggle } from "./VisionToggle";

/** A caller that chooses on the card and only then applies to the document. */
function Harness() {
  const { vision, select } = useVision();
  const [choice, setChoice] = useState<Vision>("deuteranopia");

  return (
    <>
      <VisionToggle
        value={vision === "none" ? choice : vision}
        running={vision !== "none"}
        onChange={(next) => {
          setChoice(next);
          if (vision !== "none") select(next);
        }}
      />
      <button type="button" onClick={() => select(vision === "none" ? choice : "none")}>
        {vision === "none" ? "Try the whole page" : "Back to normal"}
      </button>
    </>
  );
}

const renderHarness = () =>
  render(
    <VisionProvider>
      <Harness />
    </VisionProvider>,
  );

afterEach(() => {
  delete document.documentElement.dataset["vision"];
});

describe("vision simulation", () => {
  it("has no axe violations", async () => {
    const { container } = renderHarness();

    await expectNoAxeViolations(container);
  });

  it("names the group, because three loose chips are not a question", () => {
    renderHarness();

    expect(
      screen.getByRole("group", { name: /simulate colour vision deficiency/i }),
    ).toBeInTheDocument();
  });

  it("appends the description to the label instead of replacing it", () => {
    renderHarness();

    // SC 2.5.3: someone using voice control says the word they can read, so the
    // visible label has to lead the accessible name.
    const deutan = screen.getByRole("button", { name: "Deutan, the most common" });

    expect(deutan).toHaveTextContent("Deutan");
  });

  it("chooses without applying anything", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: /^Protan/ }));

    // The chip picks which deficiency; it does not filter the document. That
    // separation is what lets a caller preview on a card first.
    expect(document.documentElement.dataset["vision"]).toBeUndefined();
    expect(screen.getByRole("button", { name: /^Protan/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("applies the choice to the document only when asked", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: /^Tritan/ }));
    await user.click(screen.getByRole("button", { name: "Try the whole page" }));

    expect(document.documentElement.dataset["vision"]).toBe("tritanopia");
  });

  it("returns to normal vision", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Try the whole page" }));
    await user.click(screen.getByRole("button", { name: "Back to normal" }));

    expect(document.documentElement.dataset["vision"]).toBeUndefined();
  });

  it("is exclusive: choosing one releases the last", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: /^Protan/ }));
    await user.click(screen.getByRole("button", { name: /^Tritan/ }));

    expect(screen.getByRole("button", { name: /^Protan/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: /^Tritan/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("previews each deficiency on its own chip, until one is running", async () => {
    const user = userEvent.setup();
    const { container } = renderHarness();

    const dots = () => [...container.querySelectorAll("fieldset span[aria-hidden='true']")];
    expect(dots()[1]?.getAttribute("style")).toContain("ds-deuteranopia");

    await user.click(screen.getByRole("button", { name: "Try the whole page" }));

    // With the page filtered, a second pass on a dot shows a deficiency nobody
    // has. The whole page is the preview by then.
    expect(dots()[1]?.getAttribute("style") ?? "").not.toContain("ds-deuteranopia");
  });

  it("switches a running simulation straight over", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Try the whole page" }));
    expect(document.documentElement.dataset["vision"]).toBe("deuteranopia");

    await user.click(screen.getByRole("button", { name: /^Tritan/ }));

    // Choosing and applying are separate only while nothing is applied. Once a
    // simulation is running, going back to normal to pick a different one is
    // three steps to answer a question the reader asked once.
    expect(document.documentElement.dataset["vision"]).toBe("tritanopia");
  });

  it("declares the filters in linear light", () => {
    const { container } = renderHarness();

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
