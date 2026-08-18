import { useXRay } from "./useXRay";
import styles from "./XRayToggle.module.css";

/**
 * `aria-pressed` rather than a label that flips: this is a mode that stays on,
 * and a toggle button is exactly what that control is. A screen reader then
 * announces "X-ray, toggle button, pressed" instead of leaving the state to be
 * inferred from a colour change.
 */
export function XRayToggle() {
  const { enabled, toggle } = useXRay();

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={enabled}
    >
      <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
        <rect x="5" y="5" width="6" height="6" rx="1" />
      </svg>
      X-ray
      <kbd className={styles.kbd}>X</kbd>
    </button>
  );
}
