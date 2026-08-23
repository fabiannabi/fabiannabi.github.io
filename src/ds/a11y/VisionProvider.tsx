import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { VisionContext, type Deficiency, type Vision } from "./VisionContext";

/**
 * Renders the page as someone with colour vision deficiency sees it.
 *
 * The matrices are Machado, Oliveira & Fernandes (2009), "A Physiologically-based
 * Model for Simulation of Color Vision Deficiency", IEEE TVCG 15(6), at severity
 * 1.0 — full dichromacy. The same numbers gate the build in
 * scripts/audit-contrast.mjs, which re-measures every contrast pair through them.
 *
 * **`color-interpolation-filters="linearRGB"` is not optional.** The matrices are
 * defined on linear light, and `feColorMatrix` defaults to sRGB. Applying them to
 * gamma-encoded values produces a picture that looks plausible and is not the
 * simulation — which is worse than no simulation, because it invites a decision.
 *
 * This is an instrument, not an accommodation. Nobody with protanopia needs a
 * button to turn protanopia on; the button is here so that the person choosing
 * the colours has to look. What actually serves a reader with CVD is the page
 * never resting meaning on hue in the first place — see SC 1.4.1, and the
 * blueprint, which flattens the whole palette to one ink and stays readable.
 */
const FILTERS: ReadonlyArray<{ id: Vision; label: string; matrix: string }> = [
  {
    id: "protanopia",
    label: "Protanopia",
    matrix: `0.152286 1.052583 -0.204868 0 0
             0.114503 0.786281  0.099216 0 0
            -0.003882 -0.048116 1.051998 0 0
             0 0 0 1 0`,
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    matrix: `0.367322 0.860646 -0.227968 0 0
             0.280085 0.672501  0.047413 0 0
            -0.011820 0.042940  0.968881 0 0
             0 0 0 1 0`,
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    matrix: `1.255528 -0.076749 -0.178779 0 0
            -0.078411  0.930809  0.147602 0 0
             0.004733  0.691367  0.303900 0 0
             0 0 0 1 0`,
  },
];

export function VisionProvider({ children }: { children: ReactNode }) {
  /* What is on screen. There was a second value beside it — what had been
     applied, as against what was merely being shown — for an eye that rendered
     the page through a deficiency while the pointer rested on it. Nothing
     previews any more, so the two collapsed back into one. */
  const [vision, setVision] = useState<Vision>("none");

  /* Which one the controls are pointed at. It survives being switched off, so
     turning the simulation on again returns to the last deliberate pick rather
     than to a default the reader did not choose. Deuteranopia to begin with,
     because it is much the most common. */
  const [choice, setChoice] = useState<Deficiency>("deuteranopia");

  const select = useCallback((next: Vision) => {
    setVision(next);
    if (next !== "none") setChoice(next);
  }, []);

  const choose = useCallback((next: Deficiency) => setChoice(next), []);

  useEffect(() => {
    const root = document.documentElement;
    if (vision === "none") delete root.dataset["vision"];
    else root.dataset["vision"] = vision;
  }, [vision]);

  const value = useMemo(
    () => ({ vision, choice, select, choose }),
    [vision, choice, select, choose],
  );

  return (
    <VisionContext.Provider value={value}>
      {children}
      {/* Inert, unpainted, and out of the accessibility tree. It exists only so
          the stylesheet has a filter to point at. */}
      <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          {FILTERS.map((filter) => (
            <filter key={filter.id} id={`ds-${filter.id}`} colorInterpolationFilters="linearRGB">
              <feColorMatrix type="matrix" values={filter.matrix} />
            </filter>
          ))}
        </defs>
      </svg>
    </VisionContext.Provider>
  );
}

export { FILTERS };
