import { Badge } from "@fabiannabi/blueprint/components/Badge/Badge";
import { Heading } from "@fabiannabi/blueprint/components/Heading/Heading";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Link } from "@fabiannabi/blueprint/components/Link/Link";
import { Table } from "@fabiannabi/blueprint/components/Table/Table";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { useThemeAttribute } from "@fabiannabi/blueprint/hooks/useThemeAttribute";
import { region } from "@fabiannabi/blueprint/xray/instrument";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
// The same layout as the Forge case study, so the two pages read as one story.
import layout from "../Forge/Forge.module.css";
import { BUILT, FINDS, LINKS, ROADMAP, RUN_SOON, RUN_TODAY, RUNS, SAMPLE } from "./frontscan.data";
import styles from "./Frontscan.module.css";

/** /frontscan/: what the tool does, how to run it, and what it found on real open-source repos. */
export function Frontscan() {
  const { theme, toggle } = useThemeAttribute({ attribute: "dsTheme", storageKey: "ds-theme" });
  return (
    <>
      <a className={layout.skip} href="#main">
        Skip to content
      </a>

      <header className={layout.top} {...region("Header")}>
        <nav className={layout.crumbs} aria-label="Site">
          <Link href="/" font="mono" tone="subtle" size="md">
            ← Fabián Alcalá
          </Link>
          <Link href={LINKS.forge} font="mono" tone="subtle" size="md">
            How it was built
          </Link>
        </nav>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main id="main" className={layout.main}>
        <section className={layout.hero} aria-labelledby="title" {...region("Intro")}>
          <div className={layout.heroText}>
            <Badge tone="accent" shape="pill" dot>
              Open source · command-line tool
            </Badge>
            <Heading level={1} size="xl">
              <span id="title">frontscan: how your team really uses its design system</span>
            </Heading>
            <Text size="lg" tone="muted" measure>
              One command reads a frontend repo and reports the colours written by hand instead of
              tokens, each with the nearest token, and which components and props the team actually
              uses. It runs on your machine in seconds and sends nothing anywhere.
            </Text>
            <nav className={layout.links} aria-label="frontscan links">
              <Link href={LINKS.repo} font="mono" size="sm">
                frontscan on GitHub →
              </Link>
              <Link href={LINKS.forge} font="mono" size="sm">
                Built by agents in Forge →
              </Link>
            </nav>
          </div>
          <figure className={styles.terminal}>
            <div className={styles.bar} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <pre>
              <code>
                <span className={styles.prompt}>$ </span>
                {"pnpm frontscan ../cal.com\n\n"}
                {SAMPLE}
              </code>
            </pre>
            <figcaption>
              <Text size="sm" tone="muted">
                The terminal report on Cal.com, trimmed. Run it with <code>--json</code> for the full
                list.
              </Text>
            </figcaption>
          </figure>
        </section>

        <section className={layout.section} aria-labelledby="finds" {...region("What it finds")}>
          <Heading level={2} size="lg">
            <span id="finds">What one scan tells you</span>
          </Heading>
          <ul className={styles.finds}>
            {FINDS.map((f) => (
              <li key={f.title}>
                <Heading level={3} size="sm">
                  {f.title}
                </Heading>
                <Text tone="muted">{f.detail}</Text>
              </li>
            ))}
          </ul>
        </section>

        <section className={layout.section} aria-labelledby="runs" {...region("Real runs")}>
          <Heading level={2} size="lg">
            <span id="runs">On real open-source repos</span>
          </Heading>
          <Text tone="muted" measure>
            Pointed at two public codebases, at a fixed commit so anyone can check the numbers.
          </Text>
          <Table
            caption="frontscan on open-source repos"
            rowHeaders
            columns={[
              { key: "repo", header: "Repo" },
              { key: "files", header: "Files", numeric: true },
              { key: "time", header: "Time", numeric: true },
              { key: "colours", header: "Hand-written colours", numeric: true },
              { key: "components", header: "Components", numeric: true },
            ]}
            rows={RUNS.map((r) => ({
              id: r.repo,
              cells: [
                <Link key="r" href={r.url} size="sm">
                  {`${r.repo} @ ${r.commit}`}
                </Link>,
                r.files,
                r.time,
                String(r.colours),
                r.components,
              ],
            }))}
          />
          <ul className={styles.notes}>
            {RUNS.map((r) => (
              <li key={r.repo}>
                <Text>
                  <strong>{r.repo}.</strong> {r.note}
                </Text>
              </li>
            ))}
          </ul>
        </section>

        <section className={layout.section} aria-labelledby="try" {...region("Try it")}>
          <Heading level={2} size="lg">
            <span id="try">Try it</span>
          </Heading>
          <Text tone="muted" measure>
            It needs Node 24 and pnpm. Point it at any folder with a frontend in it.
          </Text>
          <pre className={styles.command}>
            <code>{RUN_TODAY.join("\n")}</code>
          </pre>
          <Text tone="muted" measure>
            Coming to npm, so it will be one line: <code className={styles.inline}>{RUN_SOON}</code>
          </Text>
        </section>

        <section className={layout.section} aria-labelledby="next" {...region("Next")}>
          <Heading level={2} size="lg">
            <span id="next">Roadmap</span>
          </Heading>
          <Text tone="muted" measure>
            From reporting what is there to suggesting the fix, then to wherever a team already works.
            Stages are priorities, not dates.
          </Text>
          <ol className={styles.roadmap}>
            {ROADMAP.map((stage) => (
              <li key={stage.name}>
                <Label size="sm" caps tone="subtle" as="p">
                  {stage.name}
                </Label>
                <Heading level={3} size="sm">
                  {stage.goal}
                </Heading>
                <ul>
                  {stage.items.map((item) => (
                    <li key={item}>
                      <Text size="sm">{item}</Text>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className={layout.section} aria-labelledby="built" {...region("How it was built")}>
          <Label size="sm" caps tone="subtle" as="p">
            How it was built
          </Label>
          <Heading level={2} size="lg">
            <span id="built">Written by agents, reviewed by me</span>
          </Heading>
          <Text measure>{BUILT.line}</Text>
          <nav className={layout.links} aria-label="Built with">
            <Link href={LINKS.forge} font="mono" size="sm">
              The Forge case study →
            </Link>
            <Link href={LINKS.design} font="mono" size="sm">
              Blueprint, the design system →
            </Link>
          </nav>
        </section>

        <footer className={layout.footer} {...region("Colophon")}>
          <Text size="sm" tone="subtle" measure>
            frontscan is MIT licensed. Figures from its own runs, 10 November 2026. This page is
            built from Blueprint.
          </Text>
        </footer>
      </main>
    </>
  );
}
