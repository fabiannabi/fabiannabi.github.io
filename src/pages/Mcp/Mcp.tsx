import { Badge } from "@fabiannabi/blueprint/components/Badge/Badge";
import { Code } from "@fabiannabi/blueprint/components/Code/Code";
import { Heading } from "@fabiannabi/blueprint/components/Heading/Heading";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Link } from "@fabiannabi/blueprint/components/Link/Link";
import { Table } from "@fabiannabi/blueprint/components/Table/Table";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { useThemeAttribute } from "@fabiannabi/blueprint/hooks/useThemeAttribute";
import { region } from "@fabiannabi/blueprint/xray/instrument";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import {
  AFTER,
  BEFORE,
  INSTALL,
  LIMITS,
  LINKS,
  LINT,
  PACKAGE,
  PROBLEMS,
  SAFETY,
  TOOLS,
  USES,
  VERSION,
} from "./mcp.data";
import styles from "./Mcp.module.css";

/**
 * What the Blueprint MCP is for, for someone who has not used one. The design
 * page documents the system for people; this page explains the same system for
 * the agents that now write much of the UI, and what changes when they can ask it.
 */
export function Mcp() {
  // Same key as /design/: the two pages are one site and keep one theme.
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
          <Link href={LINKS.docs} font="mono" tone="subtle" size="md">
            Blueprint docs
          </Link>
        </nav>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main id="main" className={styles.main}>
        <section className={styles.hero} aria-labelledby="title" {...region("Intro")}>
          <Badge tone="accent" shape="pill" dot>
            {`${PACKAGE}@${VERSION} on npm`}
          </Badge>
          <Heading level={1} size="xl">
            <span id="title">A design system coding agents can read</span>
          </Heading>
          <Text size="lg" tone="muted" measure>
            The Blueprint MCP gives an AI coding agent — Claude Code, Cursor, Windsurf — the
            design system&rsquo;s manual and a reviewer. Before it writes UI it can ask which
            component to use and which token means what; after, it can check its own work. It
            does not write the UI for you. It makes the agent that does write it use the system.
          </Text>
          <nav className={styles.links} aria-label="Blueprint MCP links">
            <Link href={LINKS.npm} font="mono" size="sm">
              npm →
            </Link>
            <Link href={LINKS.source} font="mono" size="sm">
              Source →
            </Link>
            <Link href={LINKS.security} font="mono" size="sm">
              Security →
            </Link>
            <Link href={LINKS.docs} font="mono" size="sm">
              Docs →
            </Link>
          </nav>
        </section>

        <section className={styles.section} aria-labelledby="problem" {...region("The problem")}>
          <Heading level={2} size="lg">
            <span id="problem">The problem it solves</span>
          </Heading>
          <Text tone="muted" measure>
            Ask an agent for a button that deletes a project and, without the system in reach, it
            guesses. The guesses are plausible, which is what makes them expensive: they pass
            review by eye and break the system in ways a linter would catch.
          </Text>
          <ul className={styles.list}>
            {PROBLEMS.map((p) => (
              <li key={p}>
                <Text size="sm" tone="muted">
                  {p}
                </Text>
              </li>
            ))}
          </ul>

          <div className={styles.compare}>
            <div className={styles.side}>
              <Label size="sm" caps tone="subtle" as="h3">
                Without the MCP
              </Label>
              <Code block label="Code an agent wrote without the MCP">
                {BEFORE}
              </Code>
              <Code block label="What the linter reports on it">
                {LINT}
              </Code>
            </div>
            <div className={styles.side}>
              <Label size="sm" caps tone="subtle" as="h3">
                With the MCP
              </Label>
              <Code block label="The same button, on-system">
                {AFTER}
              </Code>
              <Text size="sm" tone="muted">
                <Code>lint_ui</Code> reports nothing. The agent asked <Code>get_component</Code>{" "}
                for Button&rsquo;s variants and accessibility rules before writing it.
              </Text>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="tools" {...region("Tools")}>
          <Heading level={2} size="lg">
            <span id="tools">Five tools, all read-only</span>
          </Heading>
          <Text tone="muted" measure>
            Every answer comes from a manifest generated out of the same registry the docs page
            renders, so an agent and a person reading the docs are told the same thing.
          </Text>
          <Table
            caption="Blueprint MCP tools"
            hideCaption
            rowHeaders
            columns={[
              { key: "tool", header: "Tool" },
              { key: "asks", header: "The agent asks" },
              { key: "answers", header: "It answers with" },
            ]}
            rows={TOOLS.map((t) => ({
              id: t.name,
              cells: [<Code key="c">{t.name}</Code>, t.asks, t.answers],
            }))}
          />
        </section>

        <section className={styles.section} aria-labelledby="uses" {...region("Uses")}>
          <Heading level={2} size="lg">
            <span id="uses">Three ways it gets used</span>
          </Heading>
          <div className={styles.cards}>
            {USES.map((u) => (
              <div key={u.title} className={styles.card}>
                <Heading level={3} size="sm">
                  {u.title}
                </Heading>
                <Text size="sm" tone="muted">
                  {u.body}
                </Text>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="limits" {...region("Limits")}>
          <Heading level={2} size="lg">
            <span id="limits">What it does not do</span>
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

        <section className={styles.section} aria-labelledby="install" {...region("Install")}>
          <Heading level={2} size="lg">
            <span id="install">Use it</span>
          </Heading>
          <div className={styles.install}>
            <Label size="sm" caps tone="subtle" as="h3">
              Claude Code
            </Label>
            <Code block label="Add Blueprint to Claude Code">
              {INSTALL.claudeCode}
            </Code>
            <Label size="sm" caps tone="subtle" as="h3">
              Cursor, Windsurf, Claude Desktop
            </Label>
            <Code block label="MCP client configuration">
              {INSTALL.client}
            </Code>
            <Label size="sm" caps tone="subtle" as="h3">
              CI, without MCP
            </Label>
            <Code block label="Lint a file from the command line">
              {INSTALL.ci}
            </Code>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="safety" {...region("Safety")}>
          <Heading level={2} size="lg">
            <span id="safety">Safe to give an agent</span>
          </Heading>
          <ul className={styles.list}>
            {SAFETY.map((s) => (
              <li key={s}>
                <Text size="sm" tone="muted">
                  {s}
                </Text>
              </li>
            ))}
          </ul>
          <Link href={LINKS.security} font="mono" size="sm">
            Read the threat model →
          </Link>
        </section>

        <footer className={styles.footer} {...region("Colophon")}>
          <Text size="sm" tone="subtle" measure>
            This page is built from Blueprint and passes the MCP&rsquo;s own linter.
          </Text>
        </footer>
      </main>
    </>
  );
}
