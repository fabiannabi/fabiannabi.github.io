import { useEffect, useState } from "react";
import { useVision } from "../../ds/a11y/useVision";
import { VisionToggle } from "../../ds/a11y/VisionToggle";
import type { Vision } from "../../ds/a11y/VisionContext";
import { Badge } from "../../ds/components/Badge/Badge";
import { Button } from "../../ds/components/Button/Button";
import { Display } from "../../ds/components/Display/Display";
import { claims as copy } from "../../data/content";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ClaimPanels } from "./ClaimPanels";
import type { ClaimModel } from "./model";
import styles from "./Claims.module.css";

/**
 * The claim the cover makes about itself, and the instrument that settles it.
 *
 * One claim, not two. The structural one — every box on this page is a
 * component I wrote — went with the blueprint to the CV and to /design/, where
 * a wireframe of the page is the argument rather than a curiosity. What is left
 * here is the one claim with something to show that the page cannot show on its
 * own: a strip of the real palette, draining.
 *
 * The instruments live in the card as well now. They were in the page chrome,
 * three hundred words above the sentence that explained them.
 *
 * This component owns the facts; ClaimPanels owns where they sit. Two other
 * arrangements were built alongside it — the claim as a line of prose with the
 * control in the sentence, and a single framed stage switched by tabs — and
 * both are deleted. Keeping a losing candidate around "in case" is how a
 * codebase ends up with three ways to draw one thing.
 */
export function Claims() {
  return <ClaimPanels lead={copy.lead} claims={useClaimModels()} />;
}

/**
 * The state behind the claim.
 *
 * Which deficiency is being simulated is the provider's, not this component's,
 * even though only this card sets it: a page-wide filter is page-wide state,
 * and the day a second thing reads it a local copy would already have drifted.
 * What stays local is the walk — the specimen cycling on its own — because that
 * is this card demonstrating itself, not a fact about the page.
 */
function useClaimModels(): readonly ClaimModel[] {
  const { vision, choice, select, choose } = useVision();

  const reduced = usePrefersReducedMotion();
  const [walk, setWalk] = useState<Vision>("deuteranopia");
  const [taken, setTaken] = useState(false);

  /* The specimen follows the page whenever the page is showing anything at all,
     because they are the same simulation. Only when nothing is running does the
     card fall back to walking on its own. */
  const shown: Vision = vision === "none" ? walk : vision;

  /* The card walks the palette by itself — true colours, then each deficiency —
     so the demonstration runs whether or not anyone finds a control. Pointing
     at it was the first version and it hid the whole thing behind a gesture
     nobody knew to make.

     Pressing a chip takes it over and the walk stops: a reader who has taken
     control of a thing should not have it taken back. It refuses to start under
     prefers-reduced-motion, checked here rather than in a stylesheet, because
     nothing in CSS stops a timer. */
  useEffect(() => {
    if (taken || vision !== "none" || reduced) return;

    const order: ReadonlyArray<Vision> = [
      "none",
      "protanopia",
      "deuteranopia",
      "tritanopia",
    ];

    const interval = window.setInterval(() => {
      setWalk((current) => order[(order.indexOf(current) + 1) % order.length] ?? "none");
    }, 2200);

    return () => window.clearInterval(interval);
  }, [taken, vision, reduced]);

  const colour: ClaimModel = {
    key: "colour",
    claim: copy.colour.claim,
    answers: [
      copy.colour.resting,
      ...Object.values(copy.colour.states).map((line) => `${line} ${copy.colour.verdict}`),
    ],
    answer:
      shown === "none"
        ? copy.colour.resting
        : `${copy.colour.states[shown]} ${copy.colour.verdict}`,
    settled: vision !== "none",
    /* The cover's own accent treatment, at a size that fits a panel: the word
       carries the hue and the rule under it carries the meaning. Watch the
       first drain out and the second stay. */
    specimen: [
      <span
        key="palette"
        className={styles.palette}
        /* Filtered here only while the page is not filtered already. Two passes
           of the same matrix is a deficiency nobody has. */
        style={shown === "none" || vision !== "none" ? undefined : { filter: `url(#ds-${shown})` }}
      >
        <span className={styles.slot}>
          <Display size="xs" as="span">
            design systems
          </Display>
        </span>
        {/* The page's own six colours, in the order the palette defines them.
            One word with an underline was not enough to watch drain — a strip
            is, and it is the real palette rather than an illustration of it. */}
        <span className={styles.swatches}>
          <i className={styles.accent} />
          <i className={styles.accentLine} />
          <i className={styles.wash} />
          <i className={styles.ink} />
          <i className={styles.dim} />
        </span>
        <Badge tone="accent">Open</Badge>
      </span>,
    ],
    /* A chip is a choice that takes effect. Press Deutan and the page is
       deuteranopic — a picker that stages a value somebody then has to go and
       apply somewhere else is a form, and this is an instrument.

       There was an eye beside these for a while, first in the page chrome and
       then here: one icon that applied the chosen deficiency and previewed it
       on hover. Two controls that both start the simulation is the duplication
       this repo has undone twice already (ActionLink over Button, StatusPill
       over Badge), and the one thing the chips could not cover is the way back.
       So that is all this is. */
    instrument: (
      <>
        <VisionToggle
          value={shown === "none" ? choice : shown}
          running={vision !== "none"}
          onChange={(next) => {
            setTaken(true);
            setWalk(next);
            /* Points every instrument at it, so switching the simulation off
               and on again returns to what was chosen here rather than to a
               default the reader did not pick. */
            choose(next);
            select(next);
          }}
        />
        {/* Live in both states, and not the same job twice: with a simulation
            running it takes it off, and at rest it stops the card walking the
            palette on its own. From the reader's side those are one thing —
            put it back the way it was — which is why they share a label and a
            control rather than being an enabled and a disabled one. */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTaken(true);
            setWalk("none");
            select("none");
          }}
        >
          {copy.colour.reset}
        </Button>
      </>
    ),
  };

  return [colour];
}
