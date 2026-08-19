import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Text.module.css";

export type TextSize = "xs" | "sm" | "md" | "lead" | "fluid" | "lg" | "inherit";
export type TextTone = "default" | "muted" | "subtle" | "accent" | "danger";

type Props = {
  children: ReactNode;
  /** "inherit" is for inline emphasis: a span inside a paragraph should not
   * reset the size of the sentence it belongs to. */
  size?: TextSize;
  tone?: TextTone;
  weight?: "regular" | "medium" | "bold";
  /** p by default. span when the text sits inside a sentence. */
  as?: "p" | "span" | "div" | "label";
  /** Caps the measure. Long lines are the most common readability defect.
   * The cap is in characters and tightens as the size grows, because the same
   * count of characters is a longer line at a larger size. */
  measure?: boolean;
};

export function Text({
  children,
  size = "md",
  tone = "default",
  weight = "regular",
  as: Tag = "p",
  measure = false,
}: Props) {
  return (
    <Tag
      className={cx(styles.text, styles[size], styles[tone], styles[weight], measure && styles.measure)}
      {...xray("Text", { size, tone, ...(weight !== "regular" ? { weight } : {}) })}
    >
      {children}
    </Tag>
  );
}
