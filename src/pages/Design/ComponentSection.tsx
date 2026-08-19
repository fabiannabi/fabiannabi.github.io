import type { ReactNode } from "react";
import { Badge } from "../../ds/components/Badge/Badge";
import { Heading } from "../../ds/components/Heading/Heading";
import { Label } from "../../ds/components/Label/Label";
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
          <Label size="sm" caps tone="default" as="h3">
            Anatomy
          </Label>
          <ol className={styles.anatomy}>
            {doc.anatomy.map((part) => (
              <li key={part}>
                <Text size="sm" tone="muted" as="span">
                  {part}
                </Text>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className={styles.sub}>
        <Label size="sm" caps tone="default" as="h3">
          Props
        </Label>
        <PropsTable props={doc.props} componentName={doc.name} />
      </div>

      <div className={styles.sub}>
        <Label size="sm" caps tone="default" as="h3">
          Accessibility
        </Label>
        <ul className={styles.notes}>
          {doc.accessibility.map((note) => (
            <li key={note}>
              <Text size="sm" tone="muted" as="span">
                {note}
              </Text>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sub}>
        <Label size="sm" caps tone="default" as="h3">
          Best practices
        </Label>
        <div className={styles.guidance}>
          <div className={styles.do}>
            <Label size="sm" caps tone="accent">
              Do
            </Label>
            <ul>
              {doc.guidance.do.map((item) => (
                <li key={item}>
                  <Text size="sm" tone="muted" as="span">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.dont}>
            <Label size="sm" caps tone="danger">
              Don&rsquo;t
            </Label>
            <ul>
              {doc.guidance.dont.map((item) => (
                <li key={item}>
                  <Text size="sm" tone="muted" as="span">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
