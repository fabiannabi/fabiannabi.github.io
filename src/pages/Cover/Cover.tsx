import { Badge } from "../../ds/components/Badge/Badge";
import { Button } from "../../ds/components/Button/Button";
import { Glow } from "../../components/Glow/Glow";
import { RotatingHeadline } from "../../components/RotatingHeadline/RotatingHeadline";
import { StackRail } from "../../components/StackRail/StackRail";
import { Claims } from "../../components/Claims/Claims";
import {
  coverSub,
  headline,
  identity,
  links,
  stack,
  stats,
} from "../../data/content";
import { Display } from "../../ds/components/Display/Display";
import { Label } from "../../ds/components/Label/Label";
import { Stat } from "../../components/Stat/Stat";
import { Text } from "../../ds/components/Text/Text";
import { region } from "../../ds/xray/instrument";
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
 * The blueprint is not here. It draws every page as named boxes, which is the
 * honest way to show the site is built from the system rather than beside it —
 * and that is an argument for the CV and the design system to make. A cover
 * letter has one job, and a second instrument on it was a curiosity competing
 * with the thing the page is actually selling.
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
            <Button href={links.design} size="lg" variant="outline">
              Design system
            </Button>
            <Button href={links.email} size="lg" variant="outline">
              Email
            </Button>
            <Button href={links.linkedin} size="lg" variant="outline">
              LinkedIn
            </Button>
            <Button href={links.github} size="lg" variant="outline">
              GitHub
            </Button>
          </div>

          <div className={styles.claims} {...region("Claims")}>
            <Claims />
          </div>
        </main>

        <footer>
          <StackRail items={stack} />
        </footer>
      </div>
    </>
  );
}
