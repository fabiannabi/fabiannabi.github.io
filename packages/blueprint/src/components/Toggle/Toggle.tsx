import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Toggle.module.css";

export type ToggleSize = "sm" | "md" | "lg";

/* The button's own attributes come along, the same bargain Button makes, minus
   the three this component owns. It is what lets a caller preview the mode on
   hover or focus without a wrapper element around the control — and a wrapper
   is not a neutral thing to add: it is another box for the blueprint to draw
   around a control that is already a box. */
type NativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children" | "onClick" | "type"
>;

type Props = NativeProps & {
  /** The label. Says what the control does, not what state it is in. */
  children: ReactNode;
  /**
   * A different label while the mode is on, for a control that has to offer the
   * way back — "X-ray" becoming "Exit x-ray".
   *
   * Passing it switches the whole ARIA pattern: `aria-pressed` is dropped,
   * because a button labelled "Exit x-ray" *and* announced as pressed says two
   * contradictory things about the same state. One or the other, and the
   * component decides so a caller cannot ship both.
   */
  pressedLabel?: ReactNode;
  /** Whether the mode is currently on. */
  pressed: boolean;
  onToggle: () => void;
  /**
   * sm and md sit on the control scale, beside a Badge or a small Button. lg is
   * for a control that has to be found rather than fitted in — it is the 44px
   * step the scale already had and nothing used, which is also the AAA target
   * size (SC 2.5.5) rather than the 24px floor the other two clear.
   */
  size?: ToggleSize;
  /** Rendered before the label. Decorative — the label carries the meaning. */
  icon?: ReactNode;
  /**
   * A keyboard hint, rendered in a kbd and hidden below 640px, where there is
   * no keyboard to press it on.
   *
   * It is announced through `aria-keyshortcuts` and hidden from the accessible
   * name, which is the attribute built for this. Left in the name, the control
   * was called "X-ray X" — the hint is a visual affordance, not part of what
   * the button is.
   */
  shortcut?: string;
  /**
   * Replaces the visible label with an accessible name, for the case where the
   * icon is the whole control. Required by the type when `iconOnly` is set, the
   * same bargain Button makes.
   */
  iconOnly?: boolean;
};

type Labelled = Props & { iconOnly: true; "aria-label": string };
type Standard = Props & { iconOnly?: false };

export type ToggleProps = Labelled | Standard;

/**
 * A mode that stays on: a theme, an overlay, a filter.
 *
 * `aria-pressed`, not a label that flips. A screen reader then announces
 * "X-ray, toggle button, pressed" and the state is in the accessibility tree
 * rather than inferred from a colour change — which is what a button whose text
 * changes between "Show" and "Hide" asks a user to do.
 *
 * It knows nothing about what it toggles. The site's theme switch and the design
 * system's own x-ray control are both this component with a different label,
 * which is the test of whether a control belongs in a system: the concept it
 * switches lives in the app, the switch does not.
 */
export function Toggle({
  children,
  pressed,
  onToggle,
  size = "md",
  icon,
  shortcut,
  iconOnly = false,
  pressedLabel,
  ...rest
}: ToggleProps) {
  /* State lives in the label or in aria-pressed, never in both. */
  const label = pressedLabel !== undefined && pressed ? pressedLabel : children;

  return (
    <button
      {...rest}
      type="button"
      className={cx(styles.toggle, styles[size], iconOnly && styles.iconOnly)}
      data-pressed={pressed || undefined}
      aria-keyshortcuts={shortcut}
      onClick={onToggle}
      aria-pressed={pressedLabel === undefined ? pressed : undefined}
      {...xray("Toggle", { pressed, size, ...(iconOnly ? { iconOnly } : {}) })}
    >
      {icon}
      {iconOnly ? null : label}
      {shortcut ? (
        <kbd className={styles.kbd} aria-hidden="true">
          {shortcut}
        </kbd>
      ) : null}
    </button>
  );
}
