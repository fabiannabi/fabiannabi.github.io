import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { REDUCED_MOTION, setMediaQuery } from "../../test/media";
import { StackRail } from "./StackRail";

const items = ["React", "TypeScript", "axe-core"];

describe("StackRail", () => {
  it("gives assistive technology the list as text, not a marquee", () => {
    render(<StackRail items={items} />);

    expect(screen.getByText("Stack: React, TypeScript, axe-core.")).toBeInTheDocument();
  });

  it("hides the scrolling copy, which is duplicated for the seamless wrap", () => {
    const { container } = render(<StackRail items={items} />);

    const rail = container.querySelector('[aria-hidden="true"]');
    expect(rail).not.toBeNull();
    // Two copies of every item: the track resets by exactly half its width.
    expect(rail?.querySelectorAll("i")).toHaveLength(items.length * 2);
  });

  it("never starts the animation loop under reduced motion", () => {
    setMediaQuery(REDUCED_MOTION, true);
    const raf = vi.spyOn(window, "requestAnimationFrame");

    render(<StackRail items={items} />);

    // Nothing in CSS can stop a rAF loop, so it must not be started at all.
    expect(raf).not.toHaveBeenCalled();
  });

  it("starts the loop when motion is allowed", () => {
    const raf = vi.spyOn(window, "requestAnimationFrame");

    render(<StackRail items={items} />);

    expect(raf).toHaveBeenCalled();
  });

  it("cancels the loop on unmount", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(<StackRail items={items} />);
    unmount();

    expect(cancel).toHaveBeenCalled();
  });
});
