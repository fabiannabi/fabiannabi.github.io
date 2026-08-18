import type { ReactNode } from "react";
import styles from "./ActionLink.module.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  /** Renders the nudging arrow. Decorative, so it is hidden from AT. */
  arrow?: boolean;
};

export function ActionLink({ href, children, variant = "solid", arrow = false }: Props) {
  const external = href.startsWith("http");

  return (
    <a
      className={`${styles.action} ${variant === "ghost" ? styles.ghost : styles.solid}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
      {arrow ? (
        <span className={styles.arrow} aria-hidden="true">
          &rarr;
        </span>
      ) : null}
    </a>
  );
}
