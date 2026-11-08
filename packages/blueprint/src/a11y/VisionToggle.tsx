import { Chip } from "../components/Chip/Chip";
import { VisuallyHidden } from "../components/VisuallyHidden/VisuallyHidden";
import type { Vision } from "./VisionContext";
import styles from "./VisionToggle.module.css";

/* `share` is what the deficiency does, not whose chromosomes carry it. The usual
   citation is a ratio of men, which is accurate and leaves out the reader it is
   describing to. */
const OPTIONS: ReadonlyArray<{ id: Exclude<Vision, "none">; label: string; share: string }> = [
  { id: "protanopia", label: "Protan", share: "no working red cones" },
  { id: "deuteranopia", label: "Deutan", share: "the most common" },
  { id: "tritanopia", label: "Tritan", share: "the rare one" },
];

type Props = {
  value: Vision;
  onChange: (next: Exclude<Vision, "none">) => void;
  /** True while a simulation is running on the whole document. */
  running?: boolean;
};

/**
 * Picks which set of cones to render for. Controlled, and it applies nothing.
 *
 * An earlier version reached into the provider and filtered the document the
 * moment a chip was pressed, which made it useless for a preview: the caller
 * had no way to say "show me on this card first". Choosing and applying are
 * separate decisions and this component owns only the first.
 *
 * **Every chip previews its own effect.** The dot is the page's accent run
 * through that chip's filter, so the pink has already gone grey on the
 * deuteranopia chip before anyone presses it. Three chips reading "Protan
 * Deutan Tritan" are a debug panel; three chips that visibly disagree about a
 * colour are an invitation, and they cost one filtered span each.
 *
 * The dot is decorative and hidden — it repeats what the label says, which is
 * the only condition under which colour may carry anything (SC 1.4.1). While a
 * simulation is running the dots stop filtering, because the page filter
 * already applies to them and a second pass shows a deficiency nobody has.
 */
export function VisionToggle({ value, onChange, running = false }: Props) {
  return (
    <fieldset className={styles.group}>
      {/* A group of exclusive controls needs a group name, and this one has no
          room for a visible heading — the claim above it frames it instead. */}
      <legend>
        <VisuallyHidden>Simulate colour vision deficiency</VisuallyHidden>
      </legend>
      {OPTIONS.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          selected={value === option.id}
          onSelect={() => onChange(option.id)}
          description={option.share}
          icon={
            <span
              className={styles.swatch}
              aria-hidden="true"
              style={running ? undefined : { filter: `url(#ds-${option.id})` }}
            />
          }
        />
      ))}
    </fieldset>
  );
}
