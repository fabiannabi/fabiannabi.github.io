import { Alert } from "../../ds/components/Alert/Alert";
import { Code } from "../../ds/components/Code/Code";
import { Heading } from "../../ds/components/Heading/Heading";
import { Label } from "../../ds/components/Label/Label";
import { Link } from "../../ds/components/Link/Link";
import { Text } from "../../ds/components/Text/Text";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { byCategory, registry } from "../../ds/docs/registry";
import { useThemeAttribute } from "../../ds/hooks/useThemeAttribute";
import { region } from "../../ds/xray/instrument";
import { XRayToggle } from "../../ds/xray/XRayToggle";
import { useActiveSection } from "../../hooks/useActiveSection";
import { ComponentSection } from "./ComponentSection";
import { EXAMPLES } from "./examples";
import { Tokens } from "./Tokens";
import styles from "./Design.module.css";

const SECTION_IDS = ["overview", "tokens", ...registry.map((doc) => doc.slug)];

export function Design() {
  const { theme, toggle } = useThemeAttribute({ attribute: "dsTheme", storageKey: "ds-theme" });
  const active = useActiveSection(SECTION_IDS, "overview");

  return (
    <>
      <a className={styles.skip} href="#overview">
        Skip to content
      </a>

      <div className={styles.shell}>
        <header className={styles.sidebar}>
          <div className={styles.brand} {...region("Brand")}>
            <Link href="/" font="mono" tone="subtle" size="md">
              ← Fabián Alcalá
            </Link>
            <Heading level={1} size="md">
              Blueprint
            </Heading>
            <Text size="sm" tone="muted">
              A small design system, documented.
            </Text>
          </div>

          <nav className={styles.nav} aria-label="Components" {...region("Component index")}>
            <a
              href="#overview"
              className={active === "overview" ? `${styles.navLink} ${styles.navActive}` : styles.navLink}
              aria-current={active === "overview" ? "true" : undefined}
            >
              Overview
            </a>
            <a
              href="#tokens"
              className={active === "tokens" ? `${styles.navLink} ${styles.navActive}` : styles.navLink}
              aria-current={active === "tokens" ? "true" : undefined}
            >
              Tokens
            </a>

            {byCategory().map(([category, docs]) => (
              <div key={category} className={styles.navGroup}>
                <Label size="sm" caps tone="subtle" as="p">
                  {category}
                </Label>
                {docs.map((doc) => (
                  <a
                    key={doc.slug}
                    href={`#${doc.slug}`}
                    className={
                      active === doc.slug ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                    }
                    aria-current={active === doc.slug ? "true" : undefined}
                  >
                    {doc.name}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <div className={styles.controls}>
            <XRayToggle />
            {/* The system's own toggle. This page had a hand-rolled button here,
                which is a poor look on the page arguing for the component. */}
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </header>

        <main className={styles.main}>
          <section id="overview" className={styles.overview}>
            <Heading level={2} size="xl">
              Components you can take apart
            </Heading>

            <Text size="lg" tone="muted" measure>
              Eight components, their real props, and the accessibility decisions behind them. Every
              example on this page is the live component — not a screenshot — so it responds to the
              theme, to your keyboard, and to the x-ray.
            </Text>

            <Alert tone="info" title="Try the x-ray">
              Press <Code>X</Code>, or use the toggle, to print this page as a blueprint: the whole
              palette collapses to one cyanotype, every component is drawn as a named frame on ruled
              paper, and the gap between the two boxes is the padding the browser actually computed.
              It is a theme, not an overlay — no component stylesheet knows the mode exists. It works
              on the cover and the profile too.
            </Alert>

            <div className={styles.principles} {...region("Principles")}>
              <div>
                <Heading level={3} size="sm">
                  Three token layers
                </Heading>
                <Text size="sm" tone="muted">
                  Primitives say what a colour is, semantic tokens say what it is for, component
                  tokens apply it. A component never reaches past the middle layer, which is what
                  makes a theme a remap instead of a rewrite.
                </Text>
              </div>
              <div>
                <Heading level={3} size="sm">
                  Contrast is computed
                </Heading>
                <Text size="sm" tone="muted">
                  Every foreground and background pair in both themes is measured against WCAG 2.2 in
                  CI. The palette itself is generated in OKLCH, so the ramps are perceptually even by
                  construction rather than by eye.
                </Text>
              </div>
              <div>
                <Heading level={3} size="sm">
                  The API enforces the rules
                </Heading>
                <Text size="sm" tone="muted">
                  An icon-only button will not compile without an accessible name. A chip's remove
                  button cannot be nested inside its toggle. The guidance below is what could not be
                  made structural.
                </Text>
              </div>
            </div>
          </section>

          <Tokens />

          {registry.map((doc) => (
            <ComponentSection key={doc.slug} doc={doc} example={EXAMPLES[doc.slug]} />
          ))}

          <footer className={styles.footer} {...region("Colophon")}>
            <Text size="sm" tone="subtle" measure>
              Built with React, TypeScript and CSS Modules. No component library underneath — the
              point is the layer, not the install.
            </Text>
          </footer>
        </main>
      </div>
    </>
  );
}
