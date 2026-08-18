import type { Entry as EntryData } from "../../data/content";
import styles from "./Entry.module.css";

type Props = { entry: EntryData };

/**
 * One row of Experience, Selected work, or Writing. Three sections, one
 * component — if they drift apart visually it is because someone changed the
 * data, not the markup.
 */
export function Entry({ entry }: Props) {
  const { when, title, org, note, description, tags, badge } = entry;

  return (
    <div className={styles.entry}>
      <span className={styles.when}>{when}</span>
      <div>
        <h3 className={styles.title}>
          {title}
          {org ? <span className={styles.org}> · {org}</span> : null}
          {badge ? <span className={styles.badge}>{badge}</span> : null}
        </h3>
        {note ? <p className={styles.note}>{note}</p> : null}
        {description ? <p className={styles.description}>{description}</p> : null}
        {tags && tags.length > 0 ? (
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
