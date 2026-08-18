import { ActionLink } from "../../components/ActionLink/ActionLink";
import { Glow } from "../../components/Glow/Glow";
import { RotatingHeadline } from "../../components/RotatingHeadline/RotatingHeadline";
import { StackRail } from "../../components/StackRail/StackRail";
import { StatusPill } from "../../components/StatusPill/StatusPill";
import { coverSub, headline, identity, links, stack, stats } from "../../data/content";
import { XRayToggle } from "../../ds/xray/XRayToggle";
import styles from "./Cover.module.css";

/**
 * One screen, about a hundred words. Its only job is to earn ten seconds and a
 * click through to the profile — adding a paragraph here is a real cost.
 */
export function Cover() {
  return (
    <>
      <Glow />

      <div className={styles.wrap}>
        <div className={styles.top}>
          <div className={styles.ident}>
            <p className={styles.name}>{identity.name}</p>
            <p className={styles.role}>{identity.coverRole}</p>
          </div>
          <StatusPill pulse>{identity.status}</StatusPill>
          <XRayToggle />
        </div>

        <main className={styles.mid}>
          <RotatingHeadline
            before={headline.before}
            after={headline.after}
            words={headline.rotating}
            sentence={headline.sentence}
          />

          <p className={styles.sub}>
            {coverSub.lead} <b>{coverSub.emphasis}</b> {coverSub.tail}
          </p>

          <ul className={styles.stats}>
            {stats.map((stat) => (
              <li key={stat.label} className={styles.stat}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <ActionLink href={links.profile} arrow>
              Read the full profile
            </ActionLink>
            <ActionLink href={links.design} variant="ghost">
              Design system
            </ActionLink>
            <ActionLink href={links.email} variant="ghost">
              Email
            </ActionLink>
            <ActionLink href={links.linkedin} variant="ghost">
              LinkedIn
            </ActionLink>
            <ActionLink href={links.github} variant="ghost">
              GitHub
            </ActionLink>
          </div>
        </main>

        <StackRail items={stack} />
      </div>
    </>
  );
}
