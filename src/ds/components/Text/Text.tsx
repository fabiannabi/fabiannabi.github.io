import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Text.module.css";

export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextTone = "default" | "muted" | "subtle" | "accent" | "danger";

type Props = {
  children: ReactNode;
  size?: TextSize;
  tone?: TextTone;
  weight?: "regular" | "medium" | "bold";
  /** p by default. span when the text sits inside a sentence. */
  as?: "p" | "span" | "div" | "label";
  /** Caps the measure. Long lines are the most common readability defect. */
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
