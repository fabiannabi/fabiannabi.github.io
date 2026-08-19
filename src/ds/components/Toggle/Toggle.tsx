import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Toggle.module.css";

export type ToggleSize = "sm" | "md";

type Props = {
  /** The label. Says what the control does, not what state it is in. */
  children: ReactNode;
  /** Whether the mode is currently on. */
  pressed: boolean;
  onToggle: () => void;
  size?: ToggleSize;
  /** Rendered before the label. Decorative — the label carries the meaning. */
  icon?: ReactNode;
  /** A keyboard hint, rendered in a kbd. Hidden where there is no keyboard. */
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
  ...rest
}: ToggleProps) {
  return (
    <button
      {...rest}
      type="button"
      className={cx(styles.toggle, styles[size], iconOnly && styles.iconOnly)}
      onClick={onToggle}
      aria-pressed={pressed}
      {...xray("Toggle", { pressed, size, ...(iconOnly ? { iconOnly } : {}) })}
    >
      {icon}
      {iconOnly ? null : children}
      {shortcut ? <kbd className={styles.kbd}>{shortcut}</kbd> : null}
    </button>
  );
}
