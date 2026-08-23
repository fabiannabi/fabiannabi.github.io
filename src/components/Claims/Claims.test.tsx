import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../../ds/components/Badge/Badge";
import { expectNoAxeViolations } from "../../test/axe";
import { ClaimPanels } from "./ClaimPanels";
import type { ClaimModel } from "./model";

/**
 * The claim, as it is presented.
 */
const model = (over: Partial<ClaimModel> = {}): ClaimModel => ({
  key: "colour",
  claim: "Nothing here means anything by colour alone.",
  answers: ["At rest.", "Settled, and rather longer than the resting line."],
  answer: "At rest.",
  settled: false,
  specimen: [<Badge key="badge" tone="accent">Open</Badge>],
  instrument: <button type="button">Try the whole page</button>,
  ...over,
});

const CLAIMS = [
  model(),
  model({ key: "structure", claim: "Every box on this page is a component I wrote." }),
];

describe("ClaimPanels", () => {
  it("has no axe violations", async () => {
    const { container } = render(<ClaimPanels lead="Two claims you can check." claims={CLAIMS} />);

    await expectNoAxeViolations(container);
  });

  it("says what the instrument just showed, without interrupting", () => {
    render(<ClaimPanels lead="Two claims you can check." claims={CLAIMS} />);

    // polite, never assertive. The answer describes something the reader is
    // looking at; cutting into what a screen reader is already saying to
    // announce it would be worse than not announcing it at all.
    const [live] = screen.getAllByText("At rest.", { selector: "[aria-live] *" });
    expect(live?.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
  });

  it("keeps the specimen out of the tab order", () => {
    render(<ClaimPanels lead="Two claims you can check." claims={CLAIMS} />);

    // The sample holds real components, and one of them is a real Button. inert
    // rather than aria-hidden: hiding a focusable element from the screen reader
    // while leaving it tabbable is a violation of its own.
    for (const badge of screen.getAllByText("Open")) {
      expect(badge.closest("[inert]")).not.toBeNull();
    }
  });

  it("reserves room for the longest answer it can ever show", () => {
    // The answer and a hidden copy of every line it can hold share one grid
    // cell, so settling a claim cannot reflow the page under the cursor that
    // settled it. A min-height would be a number that is right at one width.
    const { container } = render(
      <ClaimPanels lead="Two claims you can check." claims={CLAIMS} />,
    );

    const sizers = container.querySelectorAll("[aria-hidden='true']");
    const longest = [...sizers].some((node) =>
      node.textContent?.includes("Settled, and rather longer than the resting line."),
    );

    expect(longest, "the alternate lines have to be measured somewhere").toBe(true);
  });
});
