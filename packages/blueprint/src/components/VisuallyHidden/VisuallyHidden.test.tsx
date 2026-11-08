import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        <VisuallyHidden>Announced but not painted.</VisuallyHidden>
        Painted.
      </p>,
    );

    await expectNoAxeViolations(container);
  });

  it("stays in the accessibility tree", () => {
    render(<VisuallyHidden>Announced but not painted.</VisuallyHidden>);

    // display:none and visibility:hidden would remove it from the tree as well,
    // which is the exact opposite of the point.
    expect(screen.getByText("Announced but not painted.")).toBeInTheDocument();
  });

  it("keeps its place in the reading order", () => {
    const { container } = render(
      <p>
        <VisuallyHidden>First</VisuallyHidden>
        Second
      </p>,
    );

    expect(container.textContent).toBe("FirstSecond");
  });

  it("matches the element to what it holds", () => {
    const { container } = render(<VisuallyHidden as="p">A whole paragraph.</VisuallyHidden>);

    expect(container.querySelector("p")).toBeInTheDocument();
  });
});
