import type { ReactNode } from "react";
import { local } from "../../ds/xray/instrument";
import styles from "./Beacon.module.css";

type Props = {
  /** The control being pointed at. */
  children: ReactNode;
  /**
   * Stops the pulse. Pass the mode's own state: once the thing has been used,
   * the page has nothing left to point out and a halo that keeps going is just
   * movement.
   */
  quiet?: boolean;
  /**
   * Seconds to offset the pulse by. Two beacons firing in unison read as one
   * animation across the page rather than as two controls, and the page is
   * trying to say "here, and also here".
   */
  offset?: number;
};

/**
 * A halo that says a control is worth pressing, wrapped around the control
 * rather than built into it.
 *
 * Both of the cover's instruments are quiet by design — a Toggle is a Toggle,
 * and a design system control that shouted would be useless in a toolbar. The
 * shouting is this page's problem, so it belongs to this page: the wash disc
 * and the pulse are drawn here, and the Toggle inside knows nothing about them.
 * Building them into the Toggle would have shipped the cover's conceit to
 * everyone who ever installed the system.
 *
 * **It pulses occasionally, not continuously.** One pulse every nine seconds,
 * and it stops for good the moment the control is hovered, focused or used.
 * A ring that beats without pause is the pattern this repo already has an open
 * note about, and a page arguing about vestibular safety cannot run one in the
 * corner of itself.
 *
 * Nothing here carries meaning: the ring is `aria-hidden`, the state it hints
 * at is on the control, and with the animation removed — by
 * `prefers-reduced-motion`, which the global rule honours — the disc is still
 * there saying something lives at this spot.
 */
export function Beacon({ children, quiet = false, offset = 0 }: Props) {
  return (
    <span
      className={quiet ? `${styles.beacon} ${styles.quiet}` : styles.beacon}
      style={
        offset
          ? ({ "--beacon-offset": `${offset}s` } as React.CSSProperties)
          : undefined
      }
      /* Chrome, and it has to be. The blueprint blanks a component's text and
         frames its box; wrapped around the switch that turns the blueprint off,
         that drew a box labelled BEACON over the one control the mode may not
         hide — the exemption on the Toggle inside was resolving `color:
         inherit` against a parent that had just been blanked. A halo is not
         structure and has no business being drawn, so it opts the whole subtree
         out, exactly as the switch itself does. */
      data-ds-chrome=""
      {...local("Beacon", { ...(quiet ? { quiet } : {}) })}
    >
      {/* Two elements, not two pseudo-elements: both of this one's belong to the
          x-ray, which draws its frame and its name plate with them. */}
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.ring} aria-hidden="true" />
      {children}
    </span>
  );
}
