import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Button } from "./Button";

describe("Button", () => {
  it("has no axe violations across variants", async () => {
    const { container } = render(
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="ghost">More</Button>
        <Button variant="danger">Delete</Button>
        <Button iconOnly aria-label="Delete sequence">
          <svg viewBox="0 0 16 16" aria-hidden="true" />
        </Button>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("keeps a disabled button in the tab order", async () => {
    const user = userEvent.setup();
    render(<Button disabled>Unavailable</Button>);

    const button = screen.getByRole("button");
    // aria-disabled, not the native attribute: a natively disabled button drops
    // out of the tab order and strands whoever had just focused it.
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();

    await user.tab();
    expect(button).toHaveFocus();
  });

  it("blocks activation while disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Unavailable
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("blocks activation while loading, and says it is busy", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps its label visible while loading", () => {
    render(<Button loading>Saving changes</Button>);

    // Swapping the label for a spinner makes the button change width mid-action
    // and removes the only text a screen reader had.
    expect(screen.getByRole("button")).toHaveAccessibleName("Saving changes");
  });

  it("takes its accessible name from the label", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("names an icon-only button from aria-label", () => {
    render(
      <Button iconOnly aria-label="Delete sequence" variant="danger">
        <svg viewBox="0 0 16 16" aria-hidden="true" />
      </Button>,
    );

    // The type will not compile without this prop; the assertion covers the
    // runtime half.
    expect(screen.getByRole("button")).toHaveAccessibleName("Delete sequence");
  });

  it("is operable by keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Save</Button>);

    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("stamps itself for the x-ray", () => {
    render(
      <Button variant="outline" size="lg">
        Save
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-ds-component", "Button");
    expect(button).toHaveAttribute("data-ds-props", 'variant="outline" size="lg"');
  });
});
