import { Toggle } from "../components/Toggle/Toggle";
import { useXRay } from "./useXRay";

/**
 * The blueprint's own switch, and the second caller of Toggle.
 *
 * That second caller is the whole argument for Toggle existing. One use is a
 * component nobody needed; two unrelated uses — a theme in the app, an overlay
 * in the system — are a control with a shape. The concept each one switches
 * lives with its caller; the switch does not.
 */
export function XRayToggle() {
  const { enabled, toggle } = useXRay();

  return (
    <Toggle
      pressed={enabled}
      onToggle={toggle}
      shortcut="X"
      /* The one control the blueprint may not blank. Everything else on the page
         is reduced to a box; the switch that turns the mode off has to keep
         reading as a switch, or the only way out is the keyboard shortcut whose
         hint the wireframe just hid. */
      data-ds-chrome=""
      icon={
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
          <rect x="5" y="5" width="6" height="6" rx="1" />
        </svg>
      }
    >
      X-ray
    </Toggle>
  );
}
