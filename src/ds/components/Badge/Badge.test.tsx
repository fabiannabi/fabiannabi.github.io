import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Badge>to publish</Badge>
        <Badge tone="accent" shape="pill" pulse>
          Open to lead roles
        </Badge>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("carries its meaning as text, not as a tone", () => {
    render(<Badge tone="danger">Overdue</Badge>);

    // SC 1.4.1 — a badge whose text is a bare number and whose tone is the only
    // signal says nothing to anyone who cannot tell red from green.
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("hides the dot from assistive technology", () => {
    const { container } = render(
      <Badge tone="accent" shape="pill" dot>
        Open to lead roles
      </Badge>,
    );

    const dot = container.querySelector("[aria-hidden='true']");

    expect(dot).toBeInTheDocument();
    // The dot decorates the words. Announcing it adds noise and no meaning.
    expect(screen.getByText("Open to lead roles")).toBeInTheDocument();
  });

  it("is not interactive", () => {
    render(<Badge>to publish</Badge>);

    // If it can be clicked or removed it is a Chip, and the difference matters
    // to anyone navigating by keyboard.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
