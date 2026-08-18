import styles from "./Glow.module.css";

/** The drifting wash behind the cover. Decorative; hidden from the a11y tree. */
export function Glow() {
  return <div className={styles.glow} aria-hidden="true" />;
}
