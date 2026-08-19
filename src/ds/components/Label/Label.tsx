import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Label.module.css";

export type LabelSize = "xs" | "sm" | "md" | "lead";
export type LabelTone = "default" | "muted" | "subtle" | "accent" | "danger" | "inherit";

type Props = {
  children: ReactNode;
  /** xs is a caption under a figure, sm a section marker, md a byline. */
  size?: LabelSize;
  tone?: LabelTone;
  /** "inherit" hands the colour to whatever contains it, for a Label used
   * inside a component that already owns its own tone. */
  /** Small caps for a marker rather than a sentence. */
  caps?: boolean;
  as?: "p" | "span" | "div" | "h2" | "h3";
};

/**
 * Mono micro-typography: the byline under a name, the caption under a figure,
 * the marker above a section.
 *
 * Tracking is derived from size and case rather than exposed, because that is
 * the rule it actually follows — capitals need more of it than lower case at
 * the same size, and every place this replaced had picked its own value by eye.
 * Adopting the system collapsed five trackings into three.
 *
 * `as` exists because a section marker is often the section's real heading. The
 * appearance is a label; the element still has to be able to carry the outline.
 */
export function Label({ children, size = "sm", tone = "muted", caps = false, as: Tag = "p" }: Props) {
  return (
    <Tag
      className={cx(styles.label, styles[size], styles[tone], caps && styles.caps)}
      {...xray("Label", { size, tone, ...(caps ? { caps } : {}) })}
    >
      {children}
    </Tag>
  );
}
