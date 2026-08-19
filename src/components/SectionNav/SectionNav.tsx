import { Label } from "../../ds/components/Label/Label";
import { local } from "../../ds/xray/instrument";
import styles from "./SectionNav.module.css";

/* Owned here, not imported from the site's content module — see Entry. */
export type Section = { readonly id: string; readonly label: string };

type Props = {
  sections: readonly Section[];
  activeId: string;
};

export function SectionNav({ sections, activeId }: Props) {
  return (
    <nav className={styles.nav} aria-label="Sections" {...local("SectionNav", { active: activeId })}>
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
                <Label size="md" caps tone={isActive ? "default" : "subtle"} as="span">
                  {section.label}
                </Label>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
