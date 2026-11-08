import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Display } from "./Display";

describe("Display", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Display size="md">Fabian Alcala</Display>);

    await expectNoAxeViolations(container);
  });

  it("cannot contribute to the document outline", () => {
    render(
      <>
        <Display size="lg">Fabian Alcala</Display>
        <h1>The real h1</h1>
      </>,
    );

    // The whole reason this exists: reaching for Heading to get a large size is
    // what produces an h2 that precedes the h1.
    const headings = screen.getAllByRole("heading");

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("The real h1");
  });

  it("renders a paragraph by default and a span when asked", () => {
    const { container, rerender } = render(<Display>Fabian Alcala</Display>);
    expect(container.querySelector("p")).toBeInTheDocument();

    rerender(<Display as="span">6 years</Display>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
