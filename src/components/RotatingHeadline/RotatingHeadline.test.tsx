import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { REDUCED_MOTION, setMediaQuery } from "../../test/media";
import { RotatingHeadline } from "./RotatingHeadline";

const props = {
  before: "I build the",
  after: "other teams build on.",
  words: ["design systems", "component APIs", "release pipelines"],
  sentence: "I build the design systems, component APIs and release pipelines other teams build on.",
};

const advance = async (ms: number): Promise<void> => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
};

describe("RotatingHeadline", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("announces the whole claim as one sentence", () => {
    render(<RotatingHeadline {...props} />);

    // The rotating construction alone would announce
    // "I build the other teams build on."
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(props.sentence);
  });

  it("hides the visible rotating copy from assistive technology", () => {
    const { container } = render(<RotatingHeadline {...props} />);

    const decorative = container.querySelector('[aria-hidden="true"]');
    expect(decorative).not.toBeNull();
    expect(decorative?.textContent).toContain("design systems");
  });

  it("rotates through the words when motion is allowed", async () => {
    const { container } = render(<RotatingHeadline {...props} />);
    const slot = () => container.querySelector('[aria-hidden="true"]')?.textContent ?? "";

    expect(slot()).toContain("design systems");

    // One cycle, then the fade that hides the swap.
    await advance(3400);
    await advance(320);

    expect(slot()).toContain("component APIs");
  });

  it("does not rotate when the visitor asked for reduced motion", async () => {
    setMediaQuery(REDUCED_MOTION, true);
    const { container } = render(<RotatingHeadline {...props} />);
    const slot = () => container.querySelector('[aria-hidden="true"]')?.textContent ?? "";

    await advance(3400 * 4);

    expect(slot()).toContain("design systems");
  });

  it("stops rotating if the preference is turned on mid-visit", async () => {
    const { container } = render(<RotatingHeadline {...props} />);
    const slot = () => container.querySelector('[aria-hidden="true"]')?.textContent ?? "";

    await advance(3400);
    await advance(320);
    expect(slot()).toContain("component APIs");

    await act(async () => {
      setMediaQuery(REDUCED_MOTION, true);
    });

    await advance(3400 * 3);
    expect(slot()).toContain("component APIs");
  });
});
