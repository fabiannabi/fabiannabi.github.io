import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Label } from "./Label";

describe("Label", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Label size="sm" caps as="h2">
          Selected work
        </Label>
        <Label size="md">User Interface Engineer</Label>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("can carry the outline when a marker is the section's real title", () => {
    render(
      <Label size="sm" caps as="h2">
        Selected work
      </Label>,
    );

    // The appearance is a label; the element still has to put the section in the
    // heading list a screen reader navigates by.
    expect(screen.getByRole("heading", { name: "Selected work", level: 2 })).toBeInTheDocument();
  });

  it("makes capitals with text-transform, not by typing them", () => {
    render(<Label caps>Selected work</Label>);

    // The accessible string stays sentence case, so an abbreviation is not
    // spelled out letter by letter because the design wanted caps.
    expect(screen.getByText("Selected work")).toBeInTheDocument();
  });

  it("is a paragraph unless told otherwise", () => {
    const { container } = render(<Label>User Interface Engineer</Label>);

    expect(container.querySelector("p")).toBeInTheDocument();
  });
});
