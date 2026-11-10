import { Badge } from "@fabiannabi/blueprint/components/Badge/Badge";
import { Display } from "@fabiannabi/blueprint/components/Display/Display";
import { Heading } from "@fabiannabi/blueprint/components/Heading/Heading";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Link } from "@fabiannabi/blueprint/components/Link/Link";
import { Table } from "@fabiannabi/blueprint/components/Table/Table";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { useThemeAttribute } from "@fabiannabi/blueprint/hooks/useThemeAttribute";
import { region } from "@fabiannabi/blueprint/xray/instrument";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { BOUNDARY, FOUND, FRONTSCAN, LESSON, LINKS, NEXT, OVERVIEW, PHASES, REAL_RUN, RULES, STATS, TICKETS } from "./forge.data";
import styles from "./Forge.module.css";

/**
 * Forge's case study. Forge is a private repo; this page says what it does, how it
 * keeps agents safe, and what it has built, with numbers that can be checked
 * against frontscan's public issues and pull requests. The live dashboard is the
 * showcase at /forge/showcase/.
 */
export function Forge() {
  // Same key as /design/ and /mcp/: one site, one theme.
  const { theme, toggle } = useThemeAttribute({ attribute: "dsTheme", storageKey: "ds-theme" });

  return (
    <>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <header className={styles.top} {...region("Header")}>
        <nav className={styles.crumbs} aria-label="Site">
          <Link href="/" font="mono" tone="subtle" size="md">
            ← Fabián Alcalá
          </Link>
          <Link href={LINKS.showcase} font="mono" tone="subtle" size="md">
            Live dashboard
          </Link>
        </nav>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main id="main" className={styles.main}>
        <section className={styles.hero} aria-labelledby="title" {...region("Intro")}>
          <Badge tone="accent" shape="pill" dot>
            Case study · agent platform
          </Badge>
          <Heading level={1} size="xl">
            <span id="title">Forge: agent teams that turn tickets into reviewed pull requests</span>
          </Heading>
          <Text size="lg" tone="muted" measure>
            I wanted the workflow I use at work, where an agent picks up a ticket and opens a pull
            request, with the parts I would not trust left out: no keys inside the agent, no network
            but the model, a budget per ticket, and a person deciding every merge. Forge is that
            platform. Every line of code in frontscan, a public frontend auditor, was written by
            its agents and reviewed and merged by me.
          </Text>
          <nav className={styles.links} aria-label="Forge links">
            <Link href={FRONTSCAN} font="mono" size="sm">
              frontscan on GitHub →
            </Link>
            <Link href={LINKS.showcase} font="mono" size="sm">
              Live dashboard →
            </Link>
            <Link href={LINKS.mcp} font="mono" size="sm">
              Blueprint MCP →
            </Link>
          </nav>
        </section>

        <section className={styles.overview} aria-labelledby="overview" {...region("Overview")}>
          <h2 id="overview" className={styles.srOnly}>
            Overview
          </h2>
          <dl className={styles.overviewGrid}>
            <div>
              <dt>
                <Label size="sm" caps tone="subtle" as="span">
                  My role
                </Label>
              </dt>
              <dd>
                <Text size="md">{OVERVIEW.role}</Text>
              </dd>
            </div>
            <div>
              <dt>
                <Label size="sm" caps tone="subtle" as="span">
                  Outcome
                </Label>
              </dt>
              <dd>
                <Text size="md">{OVERVIEW.outcome}</Text>
              </dd>
            </div>
            <div className={styles.overviewWide}>
              <dt>
                <Label size="sm" caps tone="subtle" as="span">
                  Built with
                </Label>
              </dt>
              <dd>
                <ul className={styles.chips}>
                  {OVERVIEW.stack.map((s) => (
                    <li key={s}>
                      <Badge tone="neutral" shape="pill">
                        {s}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.section} aria-labelledby="results" {...region("Results")}>
          <Heading level={2} size="lg">
            <span id="results">What it has built so far</span>
          </Heading>
          <dl className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt>
                  <Text as="span" size="sm" tone="muted">
                    {s.label}
                  </Text>
                </dt>
                <dd>
                  <Display size="md" as="span">
                    {s.value}
                  </Display>
                </dd>
              </div>
            ))}
          </dl>
          <Table
            caption="Every frontscan ticket Forge built"
            rowHeaders
            columns={[
              { key: "ticket", header: "Ticket" },
              { key: "pr", header: "Pull request" },
              { key: "plan", header: "Plan rounds", numeric: true },
              { key: "review", header: "Review rounds", numeric: true },
              { key: "cost", header: "Agent cost", numeric: true },
            ]}
            rows={TICKETS.map((t) => ({
              id: String(t.issue),
              cells: [
                <Link key="i" href={`${FRONTSCAN}/issues/${t.issue}`} size="sm">
                  {`#${t.issue} ${t.title}`}
                </Link>,
                <Link key="p" href={`${FRONTSCAN}/pull/${t.pr}`} font="mono" size="sm">
                  {`#${t.pr}`}
                </Link>,
                String(t.plan),
                String(t.review),
                t.cost,
              ],
            }))}
          />
          <Text size="sm" tone="muted" measure>
            The cost covers the whole ticket: the plan, the issue, the code, the review and the
            retrospective. Plan rounds count the times the plan went back and forth on the issue;
            review rounds count the Reviewer agent&rsquo;s passes.
          </Text>
          <Text tone="muted" measure>
            Pointed at {REAL_RUN.repo}, frontscan read {REAL_RUN.files} files in {REAL_RUN.time} and
            found {REAL_RUN.found}
          </Text>
        </section>

        <section className={styles.section} aria-labelledby="how" {...region("How it works")}>
          <Heading level={2} size="lg">
            <span id="how">How a ticket moves</span>
          </Heading>
          <Text tone="muted" measure>
            Agents do the work. I decide at the marked steps.
          </Text>
          <div className={styles.flow}>
            {PHASES.map((phase) => (
              <section key={phase.name} className={styles.phase} aria-label={`${phase.name} phase`}>
                <Label size="sm" caps tone="subtle" as="h3">
                  {phase.name}
                </Label>
                <ol className={styles.phaseSteps}>
                  {phase.steps.map((s) => (
                    <li key={s.title} className={s.human ? styles.decide : styles.agent}>
                      <span className={styles.who}>
                        <Label size="xs" caps tone={s.human ? "accent" : "subtle"} as="span">
                          {s.human ? "You decide" : s.who}
                        </Label>
                      </span>
                      <Text as="span" size="md" weight="medium">
                        {s.title}
                      </Text>
                      <Text as="span" size="sm" tone="muted">
                        {s.detail}
                      </Text>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="safety" {...region("Safety")}>
          <Heading level={2} size="lg">
            <span id="safety">What keeps an agent from doing damage</span>
          </Heading>
          <Text tone="muted" measure>
            Anything an agent reads can try to give it orders. Forge assumes it will, and leaves
            nothing worth stealing within reach.
          </Text>
          <figure className={styles.boundary} aria-labelledby="boundary-caption">
            <div className={styles.box}>
              <Label size="xs" caps tone="subtle" as="span">
                Sealed container
              </Label>
              <ul>
                {BOUNDARY.inside.map((x) => (
                  <li key={x}>
                    <Text as="span" size="md">
                      {x}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
            <div className={styles.box}>
              <Label size="xs" caps tone="subtle" as="span">
                Proxy
              </Label>
              <Text as="span" size="md">
                {BOUNDARY.proxy}
              </Text>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
            <div className={styles.box}>
              <Label size="xs" caps tone="subtle" as="span">
                The only way out
              </Label>
              <Text as="span" size="md">
                {BOUNDARY.out}
              </Text>
            </div>
            <div className={`${styles.box} ${styles.host}`}>
              <Label size="xs" caps tone="subtle" as="span">
                Stays on the host, never inside
              </Label>
              <Text as="span" size="md">
                {BOUNDARY.host.join(" · ")}
              </Text>
            </div>
            <figcaption id="boundary-caption">
              <Text size="sm" tone="muted" measure>
                The agent holds a placeholder, so there is no key to print or commit. Installs run
                once, before the seal, through a proxy that reaches only the package registry.
              </Text>
            </figcaption>
          </figure>
          <ul className={styles.rules}>
            {RULES.map((r) => (
              <li key={r.title} className={styles.rule}>
                <Text as="span" size="md" weight="medium">
                  {r.title}
                </Text>
                <Text as="span" size="sm" tone="muted">
                  {r.detail}
                </Text>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="learns" {...region("Learning")}>
          <Heading level={2} size="lg">
            <span id="learns">How it gets better</span>
          </Heading>
          <Text tone="muted" measure>
            After each ticket a Retro agent proposes lessons. They reach a prompt only once I approve
            them. One real one:
          </Text>
          <ol className={styles.lessonFlow}>
            <li className={styles.lessonStep}>
              <Label size="xs" caps tone="subtle" as="span">
                What happened
              </Label>
              <Text as="span" size="sm" tone="muted">
                {LESSON.problem}
              </Text>
            </li>
            <li className={`${styles.lessonStep} ${styles.lessonMain}`}>
              <Label size="xs" caps tone="accent" as="span">
                The lesson
              </Label>
              <Text as="span" size="md" weight="medium">
                {LESSON.lesson}
              </Text>
            </li>
            <li className={styles.lessonStep}>
              <Label size="xs" caps tone="subtle" as="span">
                The next ticket
              </Label>
              <Text as="span" size="sm" tone="muted">
                {LESSON.result}
              </Text>
            </li>
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="found" {...region("Iteration")}>
          <Heading level={2} size="lg">
            <span id="found">What went wrong, and what&rsquo;s next</span>
          </Heading>
          <div className={styles.twoCol}>
            <div>
              <Label size="sm" caps tone="subtle" as="h3">
                Found in real runs
              </Label>
              <ul className={styles.found}>
                {FOUND.map((f) => (
                  <li key={f.problem}>
                    <Text size="md">{f.problem}</Text>
                    <Text size="md" tone="muted">
                      → {f.fix}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label size="sm" caps tone="subtle" as="h3">
                Next
              </Label>
              <ul className={styles.found}>
                {NEXT.map((n) => (
                  <li key={n}>
                    <Text size="md">{n}</Text>
                  </li>
                ))}
              </ul>
              <Text size="sm" tone="muted" measure>
                Forge is a personal project: one real repo, one maintainer, one machine.
              </Text>
            </div>
          </div>
        </section>

        <footer className={styles.footer} {...region("Colophon")}>
          <Text size="sm" tone="subtle" measure>
            Figures from Forge&rsquo;s run log, 10 November 2026. This page is built from Blueprint.
          </Text>
        </footer>
      </main>
    </>
  );
}
