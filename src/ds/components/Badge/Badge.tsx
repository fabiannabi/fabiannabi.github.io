import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "accent" | "info" | "success" | "warning" | "danger";

type Props = {
  children: ReactNode;
  tone?: BadgeTone;
};

/**
 * A static label for the state of the thing next to it. Not interactive — if it
 * can be clicked or removed it is a Chip, and the difference matters to anyone
 * navigating by keyboard.
 *
 * The badge's own text carries the meaning ("Active", "Overdue"), so the colour
 * is reinforcement rather than the message. A badge whose text is a bare number
 * and whose tone is the only signal would fail SC 1.4.1.
 */
export function Badge({ children, tone = "neutral" }: Props) {
  return (
    <span className={cx(styles.badge, styles[tone])} {...xray("Badge", { tone })}>
      {children}
    </span>
  );
}
