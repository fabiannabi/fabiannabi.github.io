import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { experience, sections, work, practice } from "../../data/content";
import { expectNoAxeViolations } from "../../test/axe";
import { Profile } from "./Profile";

describe("Profile", () => {
  afterEach(() => {
    delete document.documentElement.dataset["theme"];
    delete document.documentElement.dataset["themeSwitching"];
    localStorage.clear();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Profile />);

    await expectNoAxeViolations(container);
  });

  it("starts with a skip link, before anything else focusable", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    await user.tab();

    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveFocus();
  });

  it("renders one heading per section", () => {
    render(<Profile />);

    for (const section of sections) {
      const label = section.label === "Work" ? "Selected work" : section.label;
      expect(screen.getByRole("heading", { level: 2, name: label })).toBeInTheDocument();
    }
  });

  it("renders every entry from the content module", () => {
    render(<Profile />);

    const total = experience.length + work.length + practice.length;
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(total);
  });

  it("toggles the theme on the document, where the tokens are scoped", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    expect(document.documentElement.dataset["theme"]).toBe("dark");

    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));

    expect(document.documentElement.dataset["theme"]).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  /* Real timers, and the flag is held for 200ms — long enough to assert without
     faking a clock, which deadlocks user-event's own waits. */
  it("cross-fades between the palettes instead of snapping", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    /* Not on load. A blocking script has already applied a palette by the time
       React runs, so fading the one on screen would be a flash of its own. */
    expect(document.documentElement.dataset["themeSwitching"]).toBeUndefined();

    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));

    // global.css hangs one colour transition off this, on every element.
    expect(document.documentElement.dataset["themeSwitching"]).toBe("");

    // And takes it off again, so nothing carries that transition at rest.
    await waitFor(() =>
      expect(document.documentElement.dataset["themeSwitching"]).toBeUndefined(),
    );
  });

  it("remembers the choice rather than re-asking the OS", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));
    await user.click(screen.getByRole("button", { name: /switch to dark theme/i }));

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("marks the section the reader is in with aria-current, not just a bar", () => {
    render(<Profile />);

    /* `hidden: true` because the nav is display:none until 1024px and jsdom does
       not evaluate media queries in getComputedStyle — it sees only the base
       rule. Whether the nav is actually visible at desktop width is a question
       for a real browser, and e2e/profile.spec.ts asks it there. */
    const current = screen.getByRole("link", { name: "About", hidden: true });
    expect(current).toHaveAttribute("aria-current", "true");
  });
});
