import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Toggle pressed={false} onToggle={() => undefined}>
          X-ray
        </Toggle>
        <Toggle pressed onToggle={() => undefined} iconOnly aria-label="Switch to light theme">
          Switch to light theme
        </Toggle>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("puts the state in the accessibility tree rather than in a colour", () => {
    const { rerender } = render(
      <Toggle pressed={false} onToggle={() => undefined}>
        X-ray
      </Toggle>,
    );

    expect(screen.getByRole("button", { name: "X-ray" })).toHaveAttribute("aria-pressed", "false");

    rerender(
      <Toggle pressed onToggle={() => undefined}>
        X-ray
      </Toggle>,
    );

    expect(screen.getByRole("button", { name: "X-ray" })).toHaveAttribute("aria-pressed", "true");
  });

  it("swaps the label and drops aria-pressed when given a way back", async () => {
    const user = userEvent.setup();

    const Harness = () => {
      const [on, setOn] = useState(false);
      return (
        <Toggle pressed={on} onToggle={() => setOn(!on)} pressedLabel="Exit x-ray">
          X-ray
        </Toggle>
      );
    };

    render(<Harness />);

    const before = screen.getByRole("button", { name: "X-ray" });
    // Absent in both states, not just the pressed one. Half the pattern is the
    // contradiction the prop exists to prevent.
    expect(before).not.toHaveAttribute("aria-pressed");

    await user.click(before);

    // One pattern or the other. A button labelled "Exit x-ray" and announced as
    // pressed says two contradictory things about the same state, so the
    // component drops aria-pressed rather than letting a caller ship both.
    const after = screen.getByRole("button", { name: "Exit x-ray" });
    expect(after).not.toHaveAttribute("aria-pressed");
    expect(after).toHaveAttribute("data-pressed");
  });

  it("keeps the same label in both states", () => {
    const { rerender } = render(
      <Toggle pressed={false} onToggle={() => undefined}>
        X-ray
      </Toggle>,
    );
    const before = screen.getByRole("button").textContent;

    rerender(
      <Toggle pressed onToggle={() => undefined}>
        X-ray
      </Toggle>,
    );

    // A label that flips between Show and Hide asks the reader to work out which
    // one they are looking at. aria-pressed carries the state instead.
    expect(screen.getByRole("button").textContent).toBe(before);
  });

  it("answers to the keyboard because it is a real button", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <Toggle pressed={false} onToggle={onToggle}>
        X-ray
      </Toggle>,
    );

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("hides the decorative icon from the accessible name", () => {
    render(
      <Toggle pressed={false} onToggle={() => undefined} icon={<span aria-hidden="true">◐</span>}>
        X-ray
      </Toggle>,
    );

    expect(screen.getByRole("button", { name: "X-ray" })).toBeInTheDocument();
  });

  it("names an icon-only toggle from its aria-label", () => {
    render(
      <Toggle
        pressed={false}
        onToggle={() => undefined}
        iconOnly
        aria-label="Switch to light theme"
        icon={<span aria-hidden="true">◐</span>}
      >
        Switch to light theme
      </Toggle>,
    );

    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();
  });

  it("carries a 44px size for a control that has to be found", () => {
    // The scale had --ds-control-lg and nothing used it. A control docked at the
    // edge of a page has the opposite problem from one in a toolbar: it is not
    // competing for room, it is competing for attention, and 44px is also the
    // AAA target size rather than the 24px floor the other two clear.
    render(
      <Toggle size="lg" pressed={false} onToggle={() => undefined}>
        Large
      </Toggle>,
    );

    expect(screen.getByRole("button", { name: "Large" }).className).toContain("lg");
  });
});
