import { Code } from "../../ds/components/Code/Code";
import { Heading } from "../../ds/components/Heading/Heading";
import { Text } from "../../ds/components/Text/Text";
import styles from "./Tokens.module.css";

/** Semantic tokens, grouped the way a consumer reaches for them. */
const GROUPS: ReadonlyArray<{ title: string; tokens: readonly string[] }> = [
  { title: "Surface", tokens: ["--ds-surface", "--ds-surface-raised", "--ds-surface-overlay"] },
  { title: "Text", tokens: ["--ds-text", "--ds-text-muted", "--ds-text-subtle"] },
  { title: "Line", tokens: ["--ds-border", "--ds-border-strong"] },
  {
    title: "Accent",
    tokens: ["--ds-accent", "--ds-accent-hover", "--ds-accent-surface", "--ds-accent-border"],
  },
  { title: "Status", tokens: ["--ds-info", "--ds-success", "--ds-warning", "--ds-danger"] },
];

const SPACE = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export function Tokens() {
  return (
    <section id="tokens" className={styles.section} aria-labelledby="tokens-title">
      <Heading level={2} size="lg">
        <span id="tokens-title">Tokens</span>
      </Heading>

      <Text tone="muted" measure>
        Three layers. A primitive is <Code>--ds-violet-400</Code>; the semantic token{" "}
        <Code>--ds-accent</Code> points at it; a component declares{" "}
        <Code>--button-bg: var(--ds-accent)</Code>. Only the middle layer is public — a component
        reaching straight for a primitive is what makes a design system impossible to re-theme
        later.
      </Text>

      <div className={styles.groups}>
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className={styles.groupHead}>{group.title}</h3>
            <ul className={styles.swatches}>
              {group.tokens.map((token) => (
                <li key={token} className={styles.swatch}>
                  <span
                    className={styles.chipColor}
                    style={{ background: `var(${token})` }}
                    aria-hidden="true"
                  />
                  <code className={styles.token}>{token}</code>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className={styles.groupHead}>Space</h3>
      <Text size="sm" tone="muted" measure>
        A 4px base. Components never use a bare pixel value, which is why the x-ray can print a
        padding and have it mean something.
      </Text>
      <ul className={styles.space}>
        {SPACE.map((step) => (
          <li key={step} className={styles.spaceItem}>
            <span
              className={styles.spaceBar}
              style={{ inlineSize: `var(--ds-space-${step})` }}
              aria-hidden="true"
            />
            <code className={styles.token}>--ds-space-{step}</code>
          </li>
        ))}
      </ul>
    </section>
  );
}
