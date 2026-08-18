import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("names the action, not the current state", () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);

    // "Switch theme" leaves a screen reader user to guess which way it goes.
    expect(screen.getByRole("button")).toHaveAccessibleName("Switch to light theme");
  });

  it("flips the label with the theme", () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);

    expect(screen.getByRole("button")).toHaveAccessibleName("Switch to dark theme");
  });

  it("is reachable and operable by keyboard", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
