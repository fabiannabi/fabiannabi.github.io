import { Chip } from "../components/Chip/Chip";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useVision } from "./useVision";
import type { Vision } from "./VisionContext";
import styles from "./VisionToggle.module.css";

const OPTIONS: ReadonlyArray<{ id: Vision; label: string; share: string }> = [
  { id: "none", label: "Normal", share: "" },
  { id: "protanopia", label: "Protan", share: "1 in 100 men" },
  { id: "deuteranopia", label: "Deutan", share: "1 in 16 men" },
  { id: "tritanopia", label: "Tritan", share: "1 in 10,000" },
];

/**
 * Picks which set of cones the page is rendered for.
 *
 * A group of Chips rather than a Toggle, because these are four exclusive
 * choices and only one can be on — a row of toggles would let two be pressed at
 * once, and a `select` would hide the options behind a click.
 *
 * The label on each chip is the short clinical name and the prevalence is
 * appended to the accessible name, because "Deutan" alone says nothing about
 * why it is the one worth looking at. Appended and not substituted: the visible
 * word still has to be what a voice-control user can say (SC 2.5.3).
 */
export function VisionToggle() {
  const { vision, select } = useVision();

  return (
    <fieldset className={styles.group}>
      {/* A group of related controls needs a group label, and this one has no
          room for a visible heading. */}
      <legend>
        <VisuallyHidden>Simulate colour vision deficiency</VisuallyHidden>
      </legend>
      {OPTIONS.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          selected={vision === option.id}
          onSelect={() => select(option.id)}
          description={option.share}
        />
      ))}
    </fieldset>
  );
}
