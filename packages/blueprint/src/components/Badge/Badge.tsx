import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import { Label } from "../Label/Label";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "accent" | "info" | "success" | "warning" | "danger";
export type BadgeShape = "square" | "pill";

type Props = {
  children: ReactNode;
  tone?: BadgeTone;
  /**
   * pill is the standalone form: rounded, control height, room for a dot. The
   * site had a separate StatusPill for it, which was this component with a
   * different radius and a dot — two components that could only ever drift.
   */
  shape?: BadgeShape;
  /** A leading dot. Decorative: the badge's own text carries the meaning. */
  dot?: boolean;
  /** Animates the dot. Implies `dot`, and stops under prefers-reduced-motion. */
  pulse?: boolean;
};

/**
 * A static label for the state of the thing next to it, or — as a pill — a
 * standalone status. Not interactive: if it can be clicked or removed it is a
 * Chip, and the difference matters to anyone navigating by keyboard.
 *
 * The badge's own text carries the meaning ("Active", "Overdue"), so the colour
 * and the dot are reinforcement rather than the message. A badge whose text is a
 * bare number and whose tone is the only signal would fail SC 1.4.1.
 */
export function Badge({
  children,
  tone = "neutral",
  shape = "square",
  dot = false,
  pulse = false,
}: Props) {
  const showDot = dot || pulse;

  return (
    <span
      className={cx(styles.badge, styles[tone], styles[shape], pulse && styles.pulse)}
      {...xray("Badge", {
        tone,
        ...(shape !== "square" ? { shape } : {}),
        ...(showDot ? { dot: true } : {}),
        ...(pulse ? { pulse } : {}),
      })}
    >
      {showDot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {/* A badge is a Label in a box: the box is this component, the words are
          not. Declaring the mono face and the size again here is how two
          components that should agree stop agreeing. */}
      <Label size={shape === "pill" ? "sm" : "xs"} tone="inherit" as="span">
        {children}
      </Label>
    </span>
  );
}
