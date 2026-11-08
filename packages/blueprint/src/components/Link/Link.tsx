import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { xray } from "../../xray/instrument";
import styles from "./Link.module.css";

export type LinkFont = "sans" | "mono";
export type LinkTone = "default" | "muted" | "subtle";
export type LinkSize = "sm" | "md";

type Props = {
  children: ReactNode;
  href: string;
  /** mono for a list of destinations, sans inside a sentence. */
  font?: LinkFont;
  tone?: LinkTone;
  /** sm is a destination in a list; md reads at body size, inside a sentence. */
  size?: LinkSize;
};

/**
 * A destination.
 *
 * Two things it does that a bare `<a>` in a stylesheet kept getting wrong here.
 *
 * The target is 24px tall (WCAG 2.2 SC 2.5.8) and gets there with padding and
 * `inline-flex`, not with line-height — line-height makes the text *look* like
 * it has room around it while leaving the hit area the height of the glyphs. A
 * 2.1-era checker passes both.
 *
 * The underline is a border that is always there and only changes colour, so
 * hovering does not reflow the line by a pixel. Underline on hover only is the
 * more common version and it is the one that shifts.
 */
export function Link({ children, href, font = "sans", tone = "default", size = "sm" }: Props) {
  return (
    <a
      href={href}
      className={cx(styles.link, styles[font], styles[tone], styles[size])}
      {...xray("Link", { font, tone, size })}
    >
      {children}
    </a>
  );
}
