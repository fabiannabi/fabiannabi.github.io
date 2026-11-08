import { Heading } from "@fabiannabi/blueprint/components/Heading/Heading";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { local } from "@fabiannabi/blueprint/xray/instrument";
import styles from "./ProjectCard.module.css";

/* Owned here, like Entry's: a card that knows what a "project" is encodes this
   site's situation, so it is app code composed from the system, not the system. */
export type ProjectCardData = {
  readonly kicker: string;
  readonly title: string;
  readonly line: string;
  readonly href: string;
};

/**
 * One project on the cover: the whole card is the link, so the target is the
 * card and not a word inside it. Its accessible name is the title and the line,
 * read in order; the arrow is decoration.
 */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const { kicker, title, line, href } = project;
  return (
    <a className={styles.card} href={href} {...local("ProjectCard", { href })}>
      <Label size="sm" caps tone="subtle" as="span">
        {kicker}
      </Label>
      <Heading level={3} size="sm">
        {title}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </Heading>
      <Text size="sm" tone="muted">
        {line}
      </Text>
    </a>
  );
}
