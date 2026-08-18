import { Entry } from "../../components/Entry/Entry";
import { SectionNav } from "../../components/SectionNav/SectionNav";
import { StatusPill } from "../../components/StatusPill/StatusPill";
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
import { useActiveSection } from "../../hooks/useActiveSection";
import { useTheme } from "../../hooks/useTheme";
import styles from "./Profile.module.css";

const SECTION_IDS = sections.map((section) => section.id);

/** Odd indices are the emphasised runs. See RichParagraph in data/content.ts. */
function RichText({ parts }: { parts: readonly string[] }) {
  return (
    <p>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>,
      )}
    </p>
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
          <div>
            <p className={styles.back}>
              <a href={links.cover}>← Back</a>
            </p>
            <h1 className={styles.name}>{identity.name}</h1>
            <p className={styles.role}>{identity.role}</p>
            <p className={styles.tagline}>{identity.tagline}</p>
            <StatusPill>{identity.statusWithLocation}</StatusPill>

            <SectionNav sections={sections} activeId={activeId} />
          </div>

          <div className={styles.social}>
            <a className={styles.socialLink} href={links.linkedin}>
              LinkedIn
            </a>
            <a className={styles.socialLink} href={links.github}>
              GitHub
            </a>
            <a className={styles.socialLink} href={links.email}>
              Email
            </a>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </header>

        <main className={styles.right}>
          <section id="about" className={styles.about}>
            <h2 className={styles.sectionHead}>About</h2>
            {about.map((paragraph, index) => (
              <RichText key={index} parts={paragraph} />
            ))}
            <p className={personalLine.isPlaceholder ? styles.todo : undefined} title={personalLine.hint}>
              {personalLine.text}
            </p>
          </section>

          <section id="experience">
            <h2 className={styles.sectionHead}>Experience</h2>
            {experience.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </section>

          <section id="work">
            <h2 className={styles.sectionHead}>Selected work</h2>
            {work.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </section>

          <section id="writing">
            <h2 className={styles.sectionHead}>Writing</h2>
            {writing.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </section>

          <footer>
            <p className={styles.colophon}>{colophon}</p>
          </footer>
        </main>
      </div>
    </>
  );
}
