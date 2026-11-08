import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Code } from "./Code";

describe("Code", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Code>--ds-accent</Code>
        <Code block label="Button usage">{`<Button variant="danger">Remove</Button>`}</Code>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("renders a real code element", () => {
    const { container } = render(<Code>--ds-accent</Code>);

    expect(container.querySelector("code")).toHaveTextContent("--ds-accent");
  });

  it("makes a scrollable block reachable from the keyboard", () => {
    render(<Code block label="Button usage">{"a very long line"}</Code>);

    // SC 2.1.1: a block that scrolls sideways has to be focusable, or a keyboard
    // user cannot reach the part of it that is off screen.
    const region = screen.getByRole("region", { name: /button usage/i });

    expect(region).toHaveAttribute("tabindex", "0");
  });
});
