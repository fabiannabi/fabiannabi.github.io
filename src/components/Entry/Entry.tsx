import { Badge } from "../../ds/components/Badge/Badge";
import { Heading } from "../../ds/components/Heading/Heading";
import { Label } from "../../ds/components/Label/Label";
import { Text } from "../../ds/components/Text/Text";
import { local } from "../../ds/xray/instrument";
import styles from "./Entry.module.css";

/* Owned here rather than imported from the site's content module. A design
   system that reaches into the product for a type cannot be lifted out of it,
   which is the whole claim src/ds makes about itself. */
export type EntryData = {
  readonly when: string;
  readonly title: string;
  readonly org?: string;
  readonly note?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly badge?: string;
};

type Props = { entry: EntryData };

/**
 * One row of Experience, Selected work, or Writing. Three sections, one
 * component — if they drift apart visually it is because someone changed the
 * data, not the markup.
 */
export function Entry({ entry }: Props) {
  const { when, title, org, note, description, tags, badge } = entry;

  return (
    <div
      className={styles.entry}
      {...local("Entry", { ...(tags ? { tags: tags.length } : {}), ...(badge ? { badge } : {}) })}
    >
      <div className={styles.when}>
        <Label size="sm" tone="subtle" as="span">
          {when}
        </Label>
      </div>
      <div>
        <Heading level={3} size="sm">
          {title}
          {org ? (
            <Text as="span" size="inherit" tone="muted" weight="medium">
              {" · "}
              {org}
            </Text>
          ) : null}
          {badge ? (
            <span className={styles.badgeSlot}>
              <Badge shape="pill">{badge}</Badge>
            </span>
          ) : null}
        </Heading>
        {note ? (
          <div className={styles.note}>
            <Label size="sm" tone="accent">
              {note}
            </Label>
          </div>
        ) : null}
        {description ? (
          <div className={styles.description}>
            <Text size="sm" tone="muted">
              {description}
            </Text>
          </div>
        ) : null}
        {tags && tags.length > 0 ? (
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag}>
                <Badge tone="accent" shape="pill">
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
