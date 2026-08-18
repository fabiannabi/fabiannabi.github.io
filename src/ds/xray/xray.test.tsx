import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { REDUCED_MOTION, setMediaQuery } from "../../test/media";
import { Button } from "../components/Button/Button";
import { XRayProvider } from "./XRayProvider";
import { XRayToggle } from "./XRayToggle";
import { formatProps, xray } from "./instrument";

const root = () => document.documentElement;

function Harness() {
  return (
    <XRayProvider>
      <XRayToggle />
      <Button variant="outline">Save</Button>
    </XRayProvider>
  );
}

afterEach(() => {
  delete root().dataset["xray"];
});

describe("formatProps", () => {
  it("prints a short, readable signature", () => {
    expect(formatProps({ variant: "primary", size: "md" })).toBe('variant="primary" size="md"');
  });

  it("prints a true boolean as a bare prop", () => {
    expect(formatProps({ loading: true })).toBe("loading");
  });

  it("drops what cannot be shown as a short literal", () => {
    // Printing "[object Object]" on a blueprint is worse than printing nothing.
    expect(
      formatProps({
        onClick: () => undefined,
        children: { type: "div" },
        variant: "ghost",
        hidden: false,
        title: undefined,
      }),
    ).toBe('variant="ghost"');
  });

  it("omits the props attribute entirely when there is nothing to say", () => {
    expect(xray("Glow")).toEqual({ "data-ds-component": "Glow" });
  });
});

describe("XRayToggle", () => {
  it("is a toggle button that reports its state", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const toggle = screen.getByRole("button", { name: /x-ray/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("marks the document so the blueprint stylesheet applies", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(root().dataset["xray"]).toBeUndefined();

    await user.click(screen.getByRole("button", { name: /x-ray/i }));
    expect(root().dataset["xray"]).toBe("on");
  });

  it("does nothing to instrumented elements while it is off", () => {
    render(<Harness />);

    // The cost of the mode when unused has to be zero: no wrapper, no extra
    // node, nothing that changes layout.
    expect(root().dataset["xray"]).toBeUndefined();
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "data-ds-component",
      "Button",
    );
  });
});

describe("keyboard shortcut", () => {
  it("toggles on X", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.keyboard("x");

    expect(root().dataset["xray"]).toBe("on");
  });

  it("stays out of the way while the user is typing", async () => {
    const user = userEvent.setup();
    render(
      <XRayProvider>
        <input aria-label="Search" />
      </XRayProvider>,
    );

    await user.click(screen.getByLabelText("Search"));
    await user.keyboard("xyz");

    expect(root().dataset["xray"]).toBeUndefined();
    expect(screen.getByLabelText("Search")).toHaveValue("xyz");
  });
});

describe("turning it off", () => {
  /* Real timers on purpose. The exit is 360ms, which is cheap to wait out, and
     faking timers here deadlocks user-event's own internal waits — the test
     then times out before it can restore them, and the next test inherits a
     frozen clock. */
  it("holds a leaving state so the outlines can animate out", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const toggle = screen.getByRole("button", { name: /x-ray/i });
    await user.click(toggle);
    expect(root().dataset["xray"]).toBe("on");

    await user.click(toggle);
    // Removing the attribute on the same frame would make the blueprint vanish,
    // which reads as a bug rather than a mode.
    expect(root().dataset["xray"]).toBe("leaving");

    await waitFor(() => expect(root().dataset["xray"]).toBeUndefined(), { timeout: 2000 });
  });

  it("skips the exit animation under reduced motion", async () => {
    setMediaQuery(REDUCED_MOTION, true);
    const user = userEvent.setup();
    render(<Harness />);

    const toggle = screen.getByRole("button", { name: /x-ray/i });
    await user.click(toggle);
    await user.click(toggle);

    expect(root().dataset["xray"]).toBeUndefined();
  });
});
