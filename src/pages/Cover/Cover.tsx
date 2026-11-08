import { Badge } from "@fabiannabi/blueprint/components/Badge/Badge";
import { Button } from "@fabiannabi/blueprint/components/Button/Button";
import { Glow } from "../../components/Glow/Glow";
import { RotatingHeadline } from "../../components/RotatingHeadline/RotatingHeadline";
import { StackRail } from "../../components/StackRail/StackRail";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import {
  coverSub,
  headline,
  identity,
  links,
  projects,
  stack,
  stats,
} from "../../data/content";
import { Display } from "@fabiannabi/blueprint/components/Display/Display";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Link } from "@fabiannabi/blueprint/components/Link/Link";
import { Stat } from "../../components/Stat/Stat";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { region } from "@fabiannabi/blueprint/xray/instrument";
import styles from "./Cover.module.css";

/**
 * One screen, about a hundred words. Its only job is to earn ten seconds and a
 * click through to the profile — adding a paragraph here is a real cost.
 *
 * The three landmarks are load-bearing, not decoration: axe reported the
 * identity block, the status badge and the rail as content outside any region,
 * which leaves a screen reader user no way to skip to them. header/main/footer
 * costs nothing and is the whole fix.
 *
 * Every piece of type on this page comes from the design system; this module's
 * stylesheet holds layout and nothing else. The split is the point: the page
 * decides where things go, the system decides what they look like.
 *
 * No instruments here. The x-ray went to the CV and the design system, and the
 * colour-vision simulator followed it to /design/: a cover letter has one job,
 * and a control competing with the pitch was a curiosity, not evidence. What
 * replaced it is the work — three project cards — and the six buttons became
 * one action plus a line of contact links.
 */
export function Cover() {
  return (
    <>
      <Glow />

      <div className={styles.wrap}>
        <header className={styles.top}>
          <div className={styles.ident} {...region("Identity")}>
            <Display size="md">{identity.name}</Display>
            <Label size="md" tone="muted">
              {identity.coverRole}
            </Label>
          </div>
          {/* Nothing but the badge up here. The instrument went down to the
              claim it settles: a control in the chrome is a button with no
              sentence attached, and the sentence it needed was three hundred
              words away at the bottom of the page. Beside the claim it cannot
              be found without reading why it exists.

              The blueprint's switch used to sit here too. It belongs to the
              design system and to the CV, where a wireframe of the page is the
              point; on a cover letter it was a curiosity competing with the
              only thing this page has to sell. */}
          <Badge tone="accent" shape="pill" pulse>
            {identity.status}
          </Badge>
        </header>

        <main className={styles.mid}>
          <RotatingHeadline
            before={headline.before}
            after={headline.after}
            words={headline.rotating}
            sentence={headline.sentence}
          />

          <div className={styles.sub}>
            <Text size="fluid" tone="muted" measure>
              {coverSub.lead}{" "}
              <Text as="span" size="inherit" weight="medium">
                {coverSub.emphasis}
              </Text>{" "}
              {coverSub.tail}
            </Text>
          </div>

          <ul className={styles.stats} {...region("Stats")}>
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </ul>

          <div className={styles.cta} {...region("Links")}>
            <Button href={links.profile} size="lg" iconEnd="→">
              Read the full profile
            </Button>
            {/* Contact is a line of text, not three more buttons: one action
                gets the weight, the rest are where to find me. */}
            <nav className={styles.contact} aria-label="Contact">
              <Link href={links.linkedin} font="mono" tone="muted">
                LinkedIn
              </Link>
              <Link href={links.github} font="mono" tone="muted">
                GitHub
              </Link>
              <Link href={links.email} font="mono" tone="muted">
                Email
              </Link>
            </nav>
          </div>

          {/* What the pitch is about, as things to open. The colour-vision
              simulator sat here and moved to /design/, where it belongs with
              the system it audits: a cover letter shows the work, it does not
              demonstrate an instrument. */}
          <section className={styles.projects} aria-labelledby="projects-title" {...region("Projects")}>
            <Label size="sm" caps tone="subtle" as="h2">
              <span id="projects-title">Projects</span>
            </Label>
            <ul className={styles.cards}>
              {projects.map((project) => (
                <li key={project.title}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer>
          <StackRail items={stack} />
        </footer>
      </div>
    </>
  );
}
