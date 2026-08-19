import type { ElementType, ReactNode } from "react";
import styles from "./VisuallyHidden.module.css";

type Props = {
  children: ReactNode;
  /** Defaults to <span>; pass "p" when the content is a paragraph. */
  as?: ElementType;
};

/**
 * Content for assistive technology that is not painted.
 *
 * `display: none` and `visibility: hidden` would remove it from the
 * accessibility tree too, which is the opposite of the point.
 */
export function VisuallyHidden({ children, as: Tag = "span" }: Props) {
  return <Tag className={styles.hidden}>{children}</Tag>;
}
