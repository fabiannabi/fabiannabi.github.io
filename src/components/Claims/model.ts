import type { ReactNode } from "react";

/**
 * One claim the page makes about itself, and everything a presentation needs to
 * put it on the screen.
 *
 * It stays a model rather than becoming ClaimPanels' props because the split is
 * worth keeping: what the claim says and what settles it is one thing, where it
 * sits on the screen is another. Two other arrangements were built against this
 * shape and deleted once the panel won.
 */
export type ClaimModel = {
  /** Stable key, and the value the stage's tabs switch on. */
  key: string;
  /** The assertion. The instrument is how you disagree with it. */
  claim: string;
  /** Every line the answer can ever be, so a row cannot change height. */
  answers: readonly string[];
  answer: string;
  /** Whether the instrument is running, which is what the answer describes. */
  settled: boolean;
  /**
   * A live sample of whatever the claim is about, rendered with the real
   * components so it changes when the instrument does.
   *
   * One node per piece: the panels drop them in staggered, and a presentation
   * that wants them in a line still gets to say so.
   */
  specimen: readonly ReactNode[];
  /** The instrument. A toggle, a group of chips, whatever settles the claim. */
  instrument: ReactNode;
  /**
   * Called when the claim is pointed at or focused, so it can demonstrate on
   * itself before anyone commits to the whole page.
   *
   * Focus as well as hover, deliberately. A preview that only answers to a
   * pointer is a feature keyboard and touch users cannot reach, and these
   * claims exist to make a point about exactly that kind of oversight.
   */
  onPreview?: (active: boolean) => void;
  /**
   * Draws the specimen as the blueprint would, without touching the page.
   *
   * The x-ray's selectors are scoped to a `[data-xray]` ancestor, so stamping
   * one is the whole mechanism — the same rules that frame the document frame
   * this box, and it cannot show something the page would not. The palette
   * comes with it: blueprint.css remaps the semantic layer on any element
   * carrying the attribute.
   */
  blueprint?: boolean;
};
