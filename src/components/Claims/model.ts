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
   * One node per piece, so a presentation can place them itself rather than
   * reaching into whatever the claim handed over.
   */
  specimen: readonly ReactNode[];
  /** The instrument. A toggle, a group of chips, whatever settles the claim. */
  instrument: ReactNode;
};

/* Two props went out of here together, and they were the same feature twice.
   `onPreview` let a panel demonstrate on itself when it was pointed at, and
   `blueprint` drew the specimen as the x-ray would by stamping a [data-xray]
   on the card. Both belonged to a second claim — every box on this page is a
   component I wrote — which moved to the CV and to /design/, where the whole
   page is the specimen rather than a panel-sized copy of it. The cover does not
   even load blueprint.css any more, so the drawing had no palette to resolve
   against. */
