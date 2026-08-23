import { Heading } from "../ds/components/Heading/Heading";
import { Label } from "../ds/components/Label/Label";
import { Text } from "../ds/components/Text/Text";
import { Exploded } from "./Exploded";
import { Reactive } from "./Reactive";
import styles from "./Lab.module.css";

/**
 * Prototypes. Served by `pnpm dev` at /lab/ and by nothing else.
 *
 * `lab/index.html` is deliberately absent from vite.config's input list: Vite's
 * dev server hands back any HTML under the project root, and `vite build`
 * compiles only what it is named. So this page costs the site nothing — not a
 * byte of the cover's budget, not a line of the deploy — and can carry ideas
 * that have not earned their way onto the cover yet.
 *
 * Both experiments here are answers to the same question, at two different
 * altitudes: what does it look like for a page to let you check it rather than
 * ask you to believe it.
 */
export function Lab() {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <Label size="sm" caps tone="accent">
          Prototypes · never deployed
        </Label>
        <Heading level={1} size="lg">
          Lab
        </Heading>
        <Text tone="muted" measure>
          Two ideas that are not on the cover. Both are built from the real
          design system, both are keyboard-first, and neither is finished — the
          notes under each one say what is still wrong with it.
        </Text>
      </header>

      <Reactive />
      <Exploded />
    </main>
  );
}
