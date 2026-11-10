import { Badge } from "@fabiannabi/blueprint/components/Badge/Badge";
import { Code } from "@fabiannabi/blueprint/components/Code/Code";
import { Display } from "@fabiannabi/blueprint/components/Display/Display";
import { Heading } from "@fabiannabi/blueprint/components/Heading/Heading";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Link } from "@fabiannabi/blueprint/components/Link/Link";
import { Table } from "@fabiannabi/blueprint/components/Table/Table";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { useThemeAttribute } from "@fabiannabi/blueprint/hooks/useThemeAttribute";
import { region } from "@fabiannabi/blueprint/xray/instrument";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { FRONTSCAN, LESSON, LIMITS, LINKS, REAL_RUN, SAFETY, STACK, STATS, STEPS, TICKETS } from "./forge.data";
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
            Agents do the work; a person decides at three points: the plan, the build, the merge.
          </Text>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={i} className={s.who === "You" ? styles.human : undefined}>
                <Label size="sm" caps tone={s.who === "You" ? "accent" : "subtle"} as="span">
                  {s.who}
                </Label>
                <Text size="sm" tone="muted">
                  {s.what}
                </Text>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="safety" {...region("Safety")}>
          <Heading level={2} size="lg">
            <span id="safety">What keeps an agent from doing damage</span>
          </Heading>
          <Text tone="muted" measure>
            An agent that reads issues, code and pull requests can be told to do things by any of
            them. Forge assumes that will happen and makes it cost nothing.
          </Text>
          <ul className={styles.list}>
            {SAFETY.map((s) => (
              <li key={s}>
                <Text size="sm" tone="muted">
                  {s}
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
            Agents used to write what they learned straight into a shared memory, and one of those
            notes stayed wrong long after the problem was fixed. Now a Retro agent proposes lessons
            after each ticket, and a lesson reaches a prompt only once I approve it. One of them:
          </Text>
          <div className={styles.lesson}>
            <Label size="sm" caps tone="subtle" as="h3">
              The lesson
            </Label>
            <Text size="sm">{LESSON.what}</Text>
            <Label size="sm" caps tone="subtle" as="h3">
              Where it came from
            </Label>
            <Text size="sm" tone="muted">
              {LESSON.why}
            </Text>
            <Label size="sm" caps tone="subtle" as="h3">
              What changed
            </Label>
            <Text size="sm" tone="muted">
              {LESSON.after}
            </Text>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="built" {...region("Stack")}>
          <Heading level={2} size="lg">
            <span id="built">What it is made of</span>
          </Heading>
          <ul className={styles.list}>
            {STACK.map((s) => (
              <li key={s}>
                <Text size="sm" tone="muted">
                  {s}
                </Text>
              </li>
            ))}
          </ul>
          <Text size="sm" tone="muted" measure>
            Agents run as <Code>claude -p</Code> in a container per step, with the worktree mounted
            and its <Code>.git</Code> read-only; git, GitHub and the key stay on the host.
          </Text>
        </section>

        <section className={styles.section} aria-labelledby="limits" {...region("Limits")}>
          <Heading level={2} size="lg">
            <span id="limits">What it is not, yet</span>
          </Heading>
          <ul className={styles.list}>
            {LIMITS.map((l) => (
              <li key={l}>
                <Text size="sm" tone="muted">
                  {l}
                </Text>
              </li>
            ))}
          </ul>
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
