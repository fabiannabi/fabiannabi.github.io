import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Heading } from "../../ds/components/Heading/Heading";
import { VisuallyHidden } from "../../ds/components/VisuallyHidden/VisuallyHidden";
import { local } from "../../ds/xray/instrument";
import { usePrefersReducedMotion } from "../../ds/hooks/usePrefersReducedMotion";
import styles from "./RotatingHeadline.module.css";

const CYCLE_MS = 3400;
const FADE_MS = 320;

type Props = {
  before: string;
  after: string;
  words: readonly string[];
  /** The whole claim as one sentence, for assistive technology. */
  sentence: string;
};

/**
 * The cover's opening claim, with one word cycling.
 *
 * This is app code, not a design system component, and the audit that moved it
 * out is the reason it now reads the way it does. One page uses it, and what it
 * encapsulates is a presentation conceit — a system that shipped it would be
 * shipping this cover's idea to everyone who installed the package.
 *
 * What is left here is the behaviour: a timer, a measurement, and a fade. The
 * type is Heading at the hero step, so the headline cannot drift away from the
 * rest of the page's typography, and the underline is measured from the word it
 * sits under.
 *
 * The h1 carries its full sentence in a VisuallyHidden and the visible rotating
 * construction is aria-hidden. Without this a screen reader announces the
 * fragments and the claim comes out ungrammatical.
 */
export function RotatingHeadline({ before, after, words, sentence }: Props) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const slotRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  const word = words[index] ?? words[0] ?? "";

  /* The underline is sized from the word it sits under. Measured in a layout
     effect so the width lands in the same frame as the new text — never a
     frame of old rule under new word. */
  useLayoutEffect(() => {
    const measure = (): void => {
      const slot = slotRef.current;
      const inner = wordRef.current;
      if (slot && inner) slot.style.setProperty("--w", `${inner.offsetWidth}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const interval = window.setInterval(() => setLeaving(true), CYCLE_MS);
    return () => window.clearInterval(interval);
  }, [reduced, words.length]);

  useEffect(() => {
    if (!leaving) return;
    // Text and underline width both change here, at zero opacity.
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % words.length);
      setLeaving(false);
    }, FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, words.length]);

  return (
    <div
      className={styles.headline}
      {...local("RotatingHeadline", { words: words.length, rotating: !reduced })}
    >
      <Heading level={1} size="hero">
        <VisuallyHidden>{sentence}</VisuallyHidden>
        <span aria-hidden="true">
          {before}{" "}
          <span className={styles.slot} ref={slotRef}>
            <span
              key={index}
              ref={wordRef}
              className={leaving ? `${styles.word} ${styles.leaving}` : styles.word}
            >
              {word}
            </span>
          </span>{" "}
          {after}
        </span>
      </Heading>
    </div>
  );
}
