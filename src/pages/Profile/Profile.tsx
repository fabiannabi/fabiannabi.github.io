import { Entry } from "../../components/Entry/Entry";
import { SectionNav } from "../../components/SectionNav/SectionNav";
import { Badge } from "../../ds/components/Badge/Badge";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import {
  about,
  colophon,
  experience,
  identity,
  links,
  personalLine,
  sections,
  work,
  writing,
} from "../../data/content";
import { Display } from "../../ds/components/Display/Display";
import { Heading } from "../../ds/components/Heading/Heading";
import { Label } from "../../ds/components/Label/Label";
import { Link } from "../../ds/components/Link/Link";
import { Text } from "../../ds/components/Text/Text";
import { region } from "../../ds/xray/instrument";
import { XRayToggle } from "../../ds/xray/XRayToggle";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useTheme } from "../../hooks/useTheme";
import styles from "./Profile.module.css";

const SECTION_IDS = sections.map((section) => section.id);

/** Odd indices are the emphasised runs. See RichParagraph in data/content.ts. */
function RichText({ parts }: { parts: readonly string[] }) {
  return (
    <Text tone="muted">
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <Text key={index} as="span" size="inherit" weight="medium">
            {part}
          </Text>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </Text>
  );
}

export function Profile() {
  const { theme, toggle } = useTheme();
  const activeId = useActiveSection(SECTION_IDS, sections[0]?.id ?? "about");

  return (
    <>
      <a className={styles.skip} href="#about">
        Skip to content
      </a>

      <div className={styles.wrap}>
        <header className={styles.left}>
          <div {...region("Identity")}>
            <div className={styles.back}>
              <Label size="sm" tone="subtle" as="div">
                <Link href={links.cover} font="mono" tone="subtle">
                  ← Back
                </Link>
              </Label>
            </div>
            <Heading level={1} size="display">
              {identity.name}
            </Heading>
            <div className={styles.role}>
              <Display size="xs">{identity.role}</Display>
            </div>
            <div className={styles.tagline}>
              <Text size="lead" tone="muted">
                {identity.tagline}
              </Text>
            </div>
            <Badge tone="accent" shape="pill" dot>
              {identity.statusWithLocation}
            </Badge>

            <SectionNav sections={sections} activeId={activeId} />
          </div>

          <div className={styles.social} {...region("Social")}>
            <Link href={links.linkedin} font="mono" tone="muted">
              LinkedIn
            </Link>
            <Link href={links.github} font="mono" tone="muted">
              GitHub
            </Link>
            <Link href={links.email} font="mono" tone="muted">
              Email
            </Link>
            <Link href="/design/" font="mono" tone="muted">
              Design system
            </Link>
            <XRayToggle />
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </header>

        <main className={styles.right}>
          <section id="about" className={styles.about} {...region("About")}>
            <div className={styles.sectionHead}>
              <Label size="sm" caps tone="default" as="h2">
                About
              </Label>
            </div>
            {about.map((paragraph, index) => (
              <RichText key={index} parts={paragraph} />
            ))}
            <div
              className={
                personalLine.isPlaceholder ? `${styles.personal} ${styles.todo}` : styles.personal
              }
              title={personalLine.hint}
            >
              <Text tone="muted">{personalLine.text}</Text>
            </div>
          </section>

          <section id="experience" {...region("Experience")}>
            <div className={styles.sectionHead}>
              <Label size="sm" caps tone="default" as="h2">
                Experience
              </Label>
            </div>
            {experience.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </section>

          <section id="work" {...region("Selected work")}>
            <div className={styles.sectionHead}>
              <Label size="sm" caps tone="default" as="h2">
                Selected work
              </Label>
            </div>
            {work.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </section>

          <section id="writing" {...region("Writing")}>
            <div className={styles.sectionHead}>
              <Label size="sm" caps tone="default" as="h2">
                Writing
              </Label>
            </div>
            {writing.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </section>

          <footer {...region("Colophon")}>
            <div className={styles.colophon}>
              <Text size="sm" tone="subtle">
                {colophon}
              </Text>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
