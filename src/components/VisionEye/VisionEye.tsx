import { Toggle } from "../../ds/components/Toggle/Toggle";
import { useVision } from "../../ds/a11y/useVision";
import { Beacon } from "../Beacon/Beacon";
import styles from "./VisionEye.module.css";

/**
 * The colour vision simulator, docked to the edge of the page.
 *
 * One touch, always in reach, and it explains itself before it is pressed:
 * pointing at it renders the whole page through the deficiency the instruments
 * are pointed at, and moving away puts it back. That preview is the entire
 * reason a control is allowed back into the chrome. A button with no sentence
 * attached is furniture — unless pressing is not required to find out what it
 * does, at which point the page itself is the label.
 *
 * Focus previews as well as hover. A demonstration only a mouse can trigger
 * would be this site losing its own argument to its own control.
 *
 * **Which deficiency it applies is not this component's decision.** It applies
 * `choice`, which the chips on the claim set and which survives being switched
 * off — so the edge control and the card cannot disagree about what is being
 * simulated, because there is one value and both read it.
 *
 * `aria-pressed` rather than a label that flips, because the label here is an
 * icon: the state has to be in the accessibility tree, not inferred from a
 * shape. The words that appear beside it on hover are `aria-hidden` — they
 * repeat the accessible name for the sighted reader and would otherwise be
 * announced twice.
 *
 * It is an instrument, not an accommodation. Nobody with protanopia needs a
 * button to turn protanopia on. It is here so the person choosing the colours
 * has to look.
 */
export function VisionEye() {
  const { applied, choice, select, preview } = useVision();
  const running = applied !== "none";

  return (
    <div className={styles.dock}>
      <span className={styles.hint} aria-hidden="true" data-ds-chrome="">
        {running ? "Stop simulating" : "See it their way"}
      </span>

      {/* The halo belongs to the page, not to the control: a Toggle that shouted
          would be useless in a toolbar. Offset from the blueprint switch above
          so the two never pulse together — in unison they read as one animation
          crossing the page rather than as two things worth pressing. */}
      <Beacon quiet={running} offset={4.5}>
        <Toggle
          size="lg"
          iconOnly
          aria-label="Simulate colour vision deficiency"
          pressed={running}
          onToggle={() => select(running ? "none" : choice)}
          onPointerEnter={() => preview(choice)}
          onPointerLeave={() => preview(null)}
          onFocus={() => preview(choice)}
          onBlur={() => preview(null)}
          /* The blueprint may not blank it, for the same reason it may not blank
           its own switch: a control the reader has to find their way back out
           through has to keep reading as a control. */
          data-ds-chrome=""
          icon={
            <svg viewBox="0 0 20 14" aria-hidden="true" focusable="false">
              <path d="M1 7s3.2-5.5 9-5.5S19 7 19 7s-3.2 5.5-9 5.5S1 7 1 7Z" />
              <circle cx="10" cy="7" r="2.6" />
            </svg>
          }
        >
          Simulate colour vision deficiency
        </Toggle>
      </Beacon>
    </div>
  );
}
