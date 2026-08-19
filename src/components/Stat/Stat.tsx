import { cx } from "../../ds/utils/cx";
import { local } from "../../ds/xray/instrument";
import { Display } from "../../ds/components/Display/Display";
import { Label } from "../../ds/components/Label/Label";
import styles from "./Stat.module.css";

type Props = {
  /** The figure. Kept short — a statistic that needs a sentence is a sentence. */
  value: string;
  label: string;
  /** li when the stat sits in a list of them, which is the usual case. */
  as?: "div" | "li";
};

/**
 * A figure and what it counts.
 *
 * Reading order is value then label, and that is the order in the DOM: the
 * common alternative — label first, then the number, visually reversed with
 * `flex-direction: column-reverse` — announces "in software, six years" and
 * looks identical while doing it. Visual order is a style; reading order is
 * content, and CSS is the wrong place to hold it.
 *
 * Composed from Display and Label rather than restyling type of its own, so a
 * change to either arrives here without this file being touched.
 */
export function Stat({ value, label, as: Tag = "li" }: Props) {
  return (
    <Tag className={cx(styles.stat)} {...local("Stat", { value })}>
      <Display size="sm" as="div">
        {value}
      </Display>
      <Label size="xs" caps as="div">
        {label}
      </Label>
    </Tag>
  );
}
