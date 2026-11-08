import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Tabs } from "./Tabs";

function Example({
  activation,
  onValueChange,
}: {
  activation?: "automatic" | "manual";
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs defaultValue="one" {...(activation ? { activation } : {})} {...(onValueChange ? { onValueChange } : {})}>
      <Tabs.List label="Example sections">
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">First panel</Tabs.Panel>
      <Tabs.Panel value="two">Second panel</Tabs.Panel>
      <Tabs.Panel value="three">Third panel</Tabs.Panel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Example />);

    await expectNoAxeViolations(container);
  });

  it("wires each tab to its panel with real ids", () => {
    render(<Example />);

    const tab = screen.getByRole("tab", { name: "One" });
    const panel = screen.getByRole("tabpanel");

    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(tab.getAttribute("aria-controls")).toBe(panel.getAttribute("id"));
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.getAttribute("id"));
  });

  it("renders only the selected panel", () => {
    render(<Example />);

    // Not merely hidden: an unselected panel is out of the DOM, so nothing in it
    // is announced or focusable.
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.queryByText("Second panel")).not.toBeInTheDocument();
  });

  it("keeps exactly one tab in the tab order", () => {
    render(<Example />);

    const tabs = screen.getAllByRole("tab");
    const reachable = tabs.filter((tab) => tab.getAttribute("tabindex") === "0");

    // Roving tabindex — Tab enters the tablist once, arrows move within it.
    expect(reachable).toHaveLength(1);
    expect(reachable[0]).toHaveAccessibleName("One");
  });

  it("moves and selects with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Second panel")).toBeInTheDocument();
  });

  it("wraps at both ends", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("jumps to the first and last tab with Home and End", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("does not select on focus when activation is manual", async () => {
    const user = userEvent.setup();
    render(<Example activation="manual" />);

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    // Focus moved; selection did not. This is what stops three arrow presses
    // from firing three requests.
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  });

  it("puts the panel in the tab order so content is reachable", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.tab();

    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("reports changes to a controlled caller", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);

    await user.click(screen.getByRole("tab", { name: "Three" }));

    expect(onValueChange).toHaveBeenCalledWith("three");
  });

  it("refuses to select a disabled tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List label="With a disabled tab">
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b" disabled>
            B
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: "B" }));

    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
  });

  it("fails loudly when a part is used outside the root", () => {
    // Rendering a tab with no tablist context would otherwise produce a tab
    // that silently controls nothing.
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<Tabs.Tab value="orphan">Orphan</Tabs.Tab>)).toThrow(
      /must be rendered inside <Tabs>/,
    );

    spy.mockRestore();
  });
});
