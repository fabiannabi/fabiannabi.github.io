import { Chip } from "../components/Chip/Chip";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import { useVision } from "./useVision";
import type { Vision } from "./VisionContext";
import styles from "./VisionToggle.module.css";

/* `share` is what the deficiency does, not whose chromosomes carry it. The
   usual citation is a ratio of men, which is accurate and leaves out the reader
   it is describing to. */
const OPTIONS: ReadonlyArray<{ id: Vision; label: string; share: string }> = [
  { id: "none", label: "Normal", share: "" },
  { id: "protanopia", label: "Protan", share: "no working red cones" },
  { id: "deuteranopia", label: "Deutan", share: "the most common" },
  { id: "tritanopia", label: "Tritan", share: "the rare one" },
];

/**
 * Picks which set of cones the page is rendered for.
 *
 * **Every chip previews its own effect.** The dot is the page's accent run
 * through that chip's filter, so the pink has already gone grey on the
 * deuteranopia chip before anyone clicks it. Four chips reading "Protan Deutan
 * Tritan" are a debug panel; four chips that visibly disagree about a colour are
 * an invitation, and they cost one filtered span each.
 *
 * The dot is decorative and hidden — it repeats what the label already says,
 * which is the only condition under which colour may carry anything at all
 * (SC 1.4.1). Losing it loses nothing.
 *
 * A group of Chips rather than Toggles, because these are four exclusive
 * choices: a row of toggles would let two be pressed at once. The prevalence is
 * appended to each accessible name — appended, never substituted, so the visible
 * word stays what a voice-control user can say (SC 2.5.3).
 */
export function VisionToggle() {
  const { vision, select } = useVision();

  return (
    <fieldset className={styles.group}>
      {/* A group of exclusive controls needs a group name, and this one has no
          room for a visible heading of its own — the cover frames it instead. */}
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
          icon={
            <span
              className={styles.swatch}
              aria-hidden="true"
              /* Only while the page is unfiltered. With a simulation running,
                 the body filter already applies to these dots, and a second
                 pass on top of it shows a deficiency nobody has. The preview
                 has done its job by then — the whole page is the preview. */
              style={
                vision === "none" && option.id !== "none"
                  ? { filter: `url(#ds-${option.id})` }
                  : undefined
              }
            />
          }
        />
      ))}
    </fieldset>
  );
}
