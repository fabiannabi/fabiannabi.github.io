import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Display.module.css";

export type DisplaySize = "xs" | "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  /** xs is a fixed subtitle; sm is a figure, md a name, lg the top of a page,
   * and those three are fluid. */
  size?: DisplaySize;
  /** p by default. span when it sits inside a larger block. */
  as?: "p" | "span" | "div" | "dd";
};

/**
 * Display type that is not a heading.
 *
 * The distinction is the whole reason this exists. A name at the top of a page,
 * or the figure in a statistic, is set at heading scale and is not part of the
 * document outline — reaching for `<Heading>` to get the size is what produces
 * an h2 that precedes the h1, or an h3 with no h2 above it. `Heading` owns the
 * outline; this owns the scale, and it renders a `<p>` or a `<span>` so it can
 * never contribute a level by accident.
 *
 * Each size carries its own tracking. At display scale letter-spacing is a
 * property of the size — the same value that looks correct at 20px is loose at
 * 50px — so exposing it as a prop would only invite it to be set wrong.
 */
export function Display({ children, size = "md", as: Tag = "p" }: Props) {
  return (
    <Tag className={cx(styles.display, styles[size])} {...xray("Display", { size, as: Tag })}>
      {children}
    </Tag>
  );
}
