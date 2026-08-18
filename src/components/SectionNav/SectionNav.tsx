import type { Section } from "../../data/content";
import { xray } from "../../ds/xray/instrument";
import styles from "./SectionNav.module.css";

type Props = {
  sections: readonly Section[];
  activeId: string;
};

export function SectionNav({ sections, activeId }: Props) {
  return (
    <nav className={styles.nav} aria-label="Sections" {...xray("SectionNav", { active: activeId })}>
      <ul className={styles.list}>
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={isActive ? `${styles.link} ${styles.active}` : styles.link}
                // The marker is visual; this is what says "you are here" out loud.
                aria-current={isActive ? "true" : undefined}
              >
                <i className={styles.marker} aria-hidden="true" />
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
