import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
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
 * The <h1> carries its full sentence in a visually hidden span, and the visible
 * rotating construction is aria-hidden. Without this a screen reader announces
 * "I build the other teams build on."
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
    <h1 className={styles.headline}>
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
    </h1>
  );
}
