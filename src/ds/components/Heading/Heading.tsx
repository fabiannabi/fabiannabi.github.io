import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Heading.module.css";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "sm" | "md" | "lg" | "xl";

type Props = {
  children: ReactNode;
  /** The document outline. Chosen by position on the page, never by appearance. */
  level: HeadingLevel;
  /** The appearance. Defaults to matching the level. */
  size?: HeadingSize;
};

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
  5: "sm",
  6: "sm",
};

/**
 * Level and size are separate props on purpose.
 *
 * The single most common heading defect is a level chosen for how big it looks,
 * which leaves a screen reader with an outline that skips from h1 to h4. Here
 * the level is the semantics and the size is the styling, so making something
 * visually smaller never costs you the document structure.
 */
export function Heading({ children, level, size }: Props) {
  const Tag = `h${level}` as const;
  const resolved = size ?? DEFAULT_SIZE[level];

  return (
    <Tag
      className={cx(styles.heading, styles[resolved])}
      {...xray("Heading", { level, size: resolved })}
    >
      {children}
    </Tag>
  );
}
