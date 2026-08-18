import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Chip label="Email" selected onSelect={() => undefined} />
        <Chip label="owner:me" onRemove={() => undefined} />
        <Chip label="read-only" />
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("never nests the remove button inside the toggle", () => {
    const { container } = render(
      <Chip label="Email" onSelect={() => undefined} onRemove={() => undefined} />,
    );

    // A button inside a button is invalid HTML, and browsers resolve it by
    // dropping one — usually the one being pressed.
    expect(container.querySelector("button button")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("names the remove button after the chip", () => {
    render(<Chip label="owner:me" onRemove={() => undefined} />);

    // Not a bare "Remove": ten chips would give a screen reader ten identical
    // entries in its element list.
    expect(screen.getByRole("button", { name: "Remove owner:me" })).toBeInTheDocument();
  });

  it("exposes selection as aria-pressed", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Chip label="Call" selected onSelect={onSelect} />);

    const toggle = screen.getByRole("button", { name: "Call" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("renders as inert content when it cannot be interacted with", () => {
    render(<Chip label="read-only" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("read-only")).toBeInTheDocument();
  });

  it("blocks both actions while disabled", async () => {
    const onSelect = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(<Chip label="Email" disabled onSelect={onSelect} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: "Email" }));
    await user.click(screen.getByRole("button", { name: "Remove Email" }));

    expect(onSelect).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });
});
