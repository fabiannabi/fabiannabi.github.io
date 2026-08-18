import { xray } from "../../ds/xray/instrument";
import styles from "./StatusPill.module.css";

type Props = {
  children: string;
  /** The cover pulses the dot; the profile keeps it still. */
  pulse?: boolean;
};

export function StatusPill({ children, pulse = false }: Props) {
  return (
    <span
      className={pulse ? `${styles.pill} ${styles.pulse}` : styles.pill}
      {...xray("StatusPill", { ...(pulse ? { pulse } : {}) })}
    >
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
