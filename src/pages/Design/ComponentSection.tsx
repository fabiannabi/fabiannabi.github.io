import type { ReactNode } from "react";
import { Badge } from "../../ds/components/Badge/Badge";
import { Heading } from "../../ds/components/Heading/Heading";
import { Text } from "../../ds/components/Text/Text";
import type { ComponentDoc } from "../../ds/docs/types";
import { PropsTable } from "./PropsTable";
import styles from "./ComponentSection.module.css";

type Props = {
  doc: ComponentDoc;
  example: ReactNode;
};

export function ComponentSection({ doc, example }: Props) {
  return (
    <section id={doc.slug} className={styles.section} aria-labelledby={`${doc.slug}-title`}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Heading level={2} size="lg">
            <span id={`${doc.slug}-title`}>{doc.name}</span>
          </Heading>
          <Badge>{doc.category}</Badge>
        </div>
        <Text tone="muted" measure>
          {doc.summary}
        </Text>
      </header>

      <div className={styles.demo}>{example}</div>

      {doc.anatomy ? (
        <div className={styles.sub}>
          <h3 className={styles.subHead}>Anatomy</h3>
          <ol className={styles.anatomy}>
            {doc.anatomy.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className={styles.sub}>
        <h3 className={styles.subHead}>Props</h3>
        <PropsTable props={doc.props} componentName={doc.name} />
      </div>

      <div className={styles.sub}>
        <h3 className={styles.subHead}>Accessibility</h3>
        <ul className={styles.notes}>
          {doc.accessibility.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className={styles.sub}>
        <h3 className={styles.subHead}>Best practices</h3>
        <div className={styles.guidance}>
          <div className={styles.do}>
            <p className={styles.guidanceHead}>Do</p>
            <ul>
              {doc.guidance.do.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.dont}>
            <p className={styles.guidanceHead}>Don&rsquo;t</p>
            <ul>
              {doc.guidance.dont.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
