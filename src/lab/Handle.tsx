import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./Handle.module.css";

export type Step = {
  /** The word the reader sees. The value *is* the text — that is the point. */
  readonly word: string;
  /** What the control reports to assistive technology at this step. */
  readonly text: string;
};

type Props = {
  /** Names the control. A slider whose only label is its own value is unnamed. */
  label: string;
  steps: readonly Step[];
  value: number;
  onChange: (next: number) => void;
};

/** How far the pointer travels for one step. Short enough to feel direct. */
const STEP_PX = 28;

/** Below this, a pointer gesture was a tap and not a drag. */
const SLOP_PX = 4;

/**
 * A word in a sentence that is also a control.
 *
 * This is the mechanism the reactive document rests on: the reader changes a
 * value that is written into the prose, and the prose around it re-reads. The
 * genre it comes from — Bret Victor's explorable explanations, and Tangle in
 * particular — solved the interaction and never solved the access. Tangle's
 * scrubbable number is drag-only: no role, no keyboard, nothing to announce.
 * That is the whole reason this is worth building here rather than borrowing.
 *
 * What it is, precisely:
 *
 * - **`role="slider"`**, because that is what it is. A stepped, bounded value
 *   the reader moves. The alternative — a button that cycles — lies about the
 *   shape of the thing and gives arrow keys nothing to do.
 * - **`aria-valuetext`**, because `aria-valuenow` is `2` and "2" is not what
 *   this control means. The number is an index into words.
 * - **Arrow keys clamp, a tap wraps.** Clamping is the ARIA slider pattern and
 *   is what a keyboard reader expects at the end of a range. A tap is not a
 *   slider gesture at all — it is "show me the next one" — so it comes round
 *   again rather than dead-ending on a word the reader is already looking at.
 * - **The drag is an enhancement.** Everything it does, the keyboard does
 *   first. A page arguing that colour is not the only channel cannot ship a
 *   control where the pointer is the only channel.
 * - **Focus moves on pointerdown**, so a value dragged with a mouse is
 *   announced by the same mechanism as a value pressed with a key. Without it,
 *   a screen reader user with a pointer gets silence.
 */
export function Handle({ label, steps, value, onChange }: Props) {
  const drag = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const step = steps[value] ?? steps[0];

  const clamp = (next: number) => Math.max(0, Math.min(steps.length - 1, next));

  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const key = event.key;
    let next = value;

    if (key === "ArrowRight" || key === "ArrowUp") next = clamp(value + 1);
    else if (key === "ArrowLeft" || key === "ArrowDown") next = clamp(value - 1);
    else if (key === "Home") next = 0;
    else if (key === "End") next = steps.length - 1;
    else if (key === "Enter" || key === " ") next = (value + 1) % steps.length;
    else return;

    event.preventDefault();
    if (next !== value) onChange(next);
  };

  const onPointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    /* Left button and primary touch only: a right-click is a context menu and
       taking it would break the one gesture every browser agrees on. */
    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    drag.current = { x: event.clientX, from: value, moved: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    const state = drag.current;
    if (!state) return;

    const delta = event.clientX - state.x;
    if (Math.abs(delta) > SLOP_PX) state.moved = true;

    const next = clamp(state.from + Math.round(delta / STEP_PX));
    if (next !== value) onChange(next);
  };

  const onPointerUp = (event: PointerEvent<HTMLSpanElement>) => {
    const state = drag.current;
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (state && !state.moved) onChange((value + 1) % steps.length);
  };

  return (
    <span
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={steps.length - 1}
      aria-valuenow={value}
      aria-valuetext={step?.text ?? ""}
      aria-orientation="horizontal"
      className={styles.handle}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {step?.word}
      {/* Decorative. The word is the value; this only says the word can move,
          and it repeats nothing the label and the value do not already carry. */}
      <span className={styles.grip} aria-hidden="true" />
    </span>
  );
}
