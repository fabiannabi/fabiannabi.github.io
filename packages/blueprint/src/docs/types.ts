/**
 * The documentation contract.
 *
 * Every component ships one of these next to its implementation. The docs site
 * and the props tables are rendered from it, so there is no second copy of the
 * API to fall out of date — the failure mode of every hand-written design system
 * docs page.
 */

export type PropDoc = {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly required?: boolean;
  readonly description: string;
};

export type ComponentCategory =
  | "Actions"
  | "Feedback"
  | "Data display"
  | "Navigation"
  | "Typography"
  /* Pieces that are not a control and not type: the visually hidden utility and
     the page atmosphere. They still have an API and still have to be documented. */
  | "Foundations";

export type ComponentDoc = {
  readonly name: string;
  readonly slug: string;
  readonly category: ComponentCategory;
  /** One sentence. What it is and when to reach for it. */
  readonly summary: string;
  /** The parts, in reading order. */
  readonly anatomy?: readonly string[];
  readonly props: readonly PropDoc[];
  /** What the component guarantees, and what it needs from the caller. */
  readonly accessibility: readonly string[];
  readonly guidance: {
    readonly do: readonly string[];
    readonly dont: readonly string[];
  };
};
