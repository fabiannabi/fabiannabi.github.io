import { useEffect, useState } from "react";
import { useVision } from "../ds/a11y/useVision";
import type { Vision } from "../ds/a11y/VisionContext";
import { Badge } from "../ds/components/Badge/Badge";
import { Code } from "../ds/components/Code/Code";
import { Display } from "../ds/components/Display/Display";
import { Heading } from "../ds/components/Heading/Heading";
import { Label } from "../ds/components/Label/Label";
import { Text } from "../ds/components/Text/Text";
import { Handle, type Step } from "./Handle";
import styles from "./Reactive.module.css";

/**
 * Prototype. Not part of the site, and never deployed — `vite build` compiles
 * only the three HTML files named in vite.config.ts, and lab/index.html is
 * deliberately not one of them. It exists in `pnpm dev` and nowhere else.
 *
 * What is being tried here is a claim with no control attached to it. The words
 * in the sentence *are* the controls: the reader changes a value that is
 * written into the prose, and the sentence underneath re-reads to describe the
 * state they just made. The genre is Bret Victor's explorable explanations and
 * the mechanism is Tangle's, minus its one real defect — see Handle.tsx.
 *
 * The second handle is the part worth arguing about. It does not demonstrate
 * that the page survives; it takes the page apart until it does not. A claim
 * that can only be confirmed is a claim nobody can check.
 */

const VISION_STEPS: ReadonlyArray<Step & { id: Vision }> = [
  { id: "none", word: "true colour", text: "True colour. No simulation running." },
  { id: "protanopia", word: "protanopia", text: "Protanopia. No working red cones." },
  {
    id: "deuteranopia",
    word: "deuteranopia",
    text: "Deuteranopia. Red against green, and much the most common.",
  },
  {
    id: "tritanopia",
    word: "tritanopia",
    text: "Tritanopia. Blue against yellow, and the rare one.",
  },
];

const CUE_STEPS: readonly Step[] = [
  { word: "every cue", text: "Every cue: the hue, the weight and the underline." },
  { word: "no underline", text: "The underline removed. Hue and weight remain." },
  { word: "hue alone", text: "Hue alone. Nothing but colour distinguishes it." },
];

/**
 * What the two handles have just proved, in one line.
 *
 * It is a function of both, and that is the difference between this and a
 * caption: there is no state the reader can reach that the page has not already
 * described. Six states, six sentences, and not one of them says "you have
 * selected deuteranopia".
 */
function verdict(simulating: boolean, cues: number): string {
  if (cues === 2) {
    return simulating
      ? "Nothing tells the term from the sentence now. This is the page I did not ship."
      : "It still reads — but only because you can see the hue. Now take the hue away.";
  }

  if (cues === 1) {
    return simulating
      ? "Weight is carrying it alone, and it holds."
      : "The underline is gone. Hue and weight are still doing the work.";
  }

  return simulating
    ? "The hue is gone. The underline, the weight and the words are not."
    : "Three channels, all doing their job. Take one away.";
}

type Exposed = {
  label: string;
  now: string;
  max: string;
  text: string;
};

export function Reactive() {
  const { vision, select } = useVision();
  const [cues, setCues] = useState(0);
  const [changes, setChanges] = useState(0);
  const [exposed, setExposed] = useState<readonly Exposed[]>([]);

  const visionAt = Math.max(
    0,
    VISION_STEPS.findIndex((step) => step.id === vision),
  );
  const simulating = vision !== "none";

  /* Read back what the controls actually expose, from the elements, after every
     change. Printing the same constants that drew them would prove nothing —
     the question is what the accessibility tree was told, and the only honest
     source for that is the DOM. */
  useEffect(() => {
    const sliders = document.querySelectorAll<HTMLElement>('[role="slider"]');

    setExposed(
      [...sliders].map((slider) => ({
        label: slider.getAttribute("aria-label") ?? "-",
        now: slider.getAttribute("aria-valuenow") ?? "-",
        max: slider.getAttribute("aria-valuemax") ?? "-",
        text: slider.getAttribute("aria-valuetext") ?? "-",
      })),
    );
  }, [vision, cues]);

  const cueClass = [styles.all, styles.noRule, styles.hueOnly][cues] ?? styles.all;

  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <Heading level={2} size="md">
          A claim with no control attached to it
        </Heading>
        <Text tone="muted" measure>
          The words in the sentence are the controls. Drag one, or focus it and use
          the arrow keys. The line underneath re-reads to describe whatever state
          you just put the page in.
        </Text>
      </header>

      <div className={styles.main}>
        {/* ---- the reactive sentence ---- */}
        <p className={styles.sentence}>
          <Text as="span" size="lead" tone="muted">
            Read this page through{" "}
          </Text>
          <Handle
            label="Colour vision"
            steps={VISION_STEPS}
            value={visionAt}
            onChange={(next) => {
              setChanges((count) => count + 1);
              select(VISION_STEPS[next]?.id ?? "none");
            }}
          />
          <Text as="span" size="lead" tone="muted">
            {" "}
            eyes, with{" "}
          </Text>
          <Handle
            label="Redundant cues"
            steps={CUE_STEPS}
            value={cues}
            onChange={(next) => {
              setChanges((count) => count + 1);
              setCues(next);
            }}
          />
          <Text as="span" size="lead" tone="muted">
            {" "}
            carrying the meaning.
          </Text>
        </p>

        {/* ---- the specimen the sentence is about ---- */}
        <p className={styles.specimen}>
          <Display size="sm" as="span">
            I build the <span className={cueClass}>design systems</span> other teams
            build on.
          </Display>
        </p>

        <p className={styles.badges}>
          <Badge tone="accent" shape="pill" dot>
            Open to lead roles
          </Badge>
          <Badge tone="danger" shape="pill" dot>
            Closed
          </Badge>
        </p>

        {/* ---- what the two handles just proved ---- */}
        {/* A div, not a p: Text renders its own paragraph, and a p inside a p is
            closed by the parser rather than nested — the DOM the browser builds
            stops matching the one React thinks it wrote. */}
        <div className={styles.verdict}>
          <Text size="lead">{verdict(simulating, cues)}</Text>
        </div>

        {/* ---- the instrument, instrumented ---- */}
        <section className={styles.panel}>
          <Heading level={3} size="sm">
            What the controls expose
          </Heading>

          <Text size="sm" tone="muted" measure>
            Read off the elements after every change, not printed from the constants
            that drew them. aria-valuenow is an index, and the reason aria-valuetext
            exists is that &quot;2&quot; is not what this control means.
          </Text>

          <ul className={styles.rows}>
            {exposed.map((row) => (
              <li key={row.label} className={styles.row}>
                <Label size="sm" caps tone="subtle">
                  {row.label}
                </Label>
                <Code>
                  {row.now} of {row.max}
                </Code>
                <Text size="sm" as="span">
                  {row.text}
                </Text>
              </li>
            ))}
          </ul>

          <ul className={styles.notes}>
            <li>
              <Text size="sm" tone="muted" as="span">
                Value changes this session: <Code>{String(changes)}</Code>. Each one
                is announced by the slider itself, which is what a slider is for.
              </Text>
            </li>
            <li>
              <Text size="sm" tone="muted" as="span">
                Live regions: <Code>0</Code>. The sentence that re-reads is not one,
                deliberately. It would fire on every step of a drag, on top of the
                value the slider is already announcing, and turn a three-word
                gesture into a queue nobody can get out of. The reader drove the
                change; the control reports it once.
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.panel}>
          <Heading level={3} size="sm">
            Still open
          </Heading>
          <ul className={styles.notes}>
            <li>
              <Text size="sm" tone="muted" as="span">
                A word that is a control has to look like one before it is touched.
                The dashed rule and the grip are the current answer and they are not
                obviously enough. The cover solves this by moving on its own until
                someone takes over, and that trick is available here.
              </Text>
            </li>
            <li>
              <Text size="sm" tone="muted" as="span">
                Touch: a tap advances one step and wraps, because dragging a word
                inside a paragraph fights the scroll. Worth testing on a real phone
                before believing it.
              </Text>
            </li>
            <li>
              <Text size="sm" tone="muted" as="span">
                Voice control says the label, not the word. &quot;Click colour
                vision&quot; works; &quot;click deuteranopia&quot; does not. That is
                correct for a slider and worth knowing before it surprises someone.
              </Text>
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}
