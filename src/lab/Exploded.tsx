import { useEffect, useRef, useState } from "react";
import { Badge } from "../ds/components/Badge/Badge";
import { Button } from "../ds/components/Button/Button";
import { Display } from "../ds/components/Display/Display";
import { Heading } from "../ds/components/Heading/Heading";
import { Label } from "../ds/components/Label/Label";
import { Text } from "../ds/components/Text/Text";
import { Stat } from "../components/Stat/Stat";
import { region } from "../ds/xray/instrument";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "./Exploded.module.css";

/**
 * The page as a physical object: one fixed three-quarter view, and every level
 * of nesting lifting onto its own plane.
 *
 * The x-ray already answers "what is this box and who owns it" in two
 * dimensions. What it cannot answer flat is **how deep the page is** — how much
 * nesting sits between the section and the word, and how much of that depth
 * belongs to the system rather than to this page. Separating the levels shows
 * it in one look.
 *
 * Three decisions, and the first two are the same decision:
 *
 * - **It is not a viewer.** No free rotation, no camera, nothing to drive. One
 *   angle, chosen because every plane is legible from it, and a separation that
 *   happens on its own. A reader who has to learn a control before the drawing
 *   means anything has been handed a toy, not an explanation.
 * - **One axis of motion.** The planes move apart along Z and nothing else
 *   moves — no rotation arriving, no pieces falling in from elsewhere. That is
 *   deliberate: dozens of thin high-contrast lines travelling in different
 *   directions is the pattern that triggers vestibular responses, and it is the
 *   open item against the blueprint's own entrance. This is what the fix looks
 *   like — same sense of construction, one direction, slower.
 * - **CSS, not a 3D library.** Every plane is a `translateZ` inside a
 *   `preserve-3d` subtree. The depth is never computed: each box lifts one step
 *   *relative to its parent*, and nesting compounds it — the rule the DOM
 *   already follows, expressed once. The only thing measured is the stagger.
 *
 * The scene is `inert` and the census under it is the real output. The drawing
 * is the illustration, not the information.
 */

type Census = { system: number; local: number; regions: number };

export function Exploded() {
  const stage = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [census, setCensus] = useState<Census>({ system: 0, local: 0, regions: 0 });
  const [run, setRun] = useState(0);
  const [separated, setSeparated] = useState(false);

  /* Two things off one walk: the ratio, and how deep each box sits.
     Depth is only ever used for the stagger — the lift itself compounds through
     the DOM and needs no number. `local()` stamps both attributes, so the system
     count has to exclude them or every one-off is counted twice. */
  useEffect(() => {
    const root = stage.current;
    if (!root) return;

    const boxes = root.querySelectorAll<HTMLElement>("[data-ds-component], [data-ds-region]");

    for (const box of boxes) {
      let depth = 0;
      for (let node = box.parentElement; node && node !== root; node = node.parentElement) {
        if (node.matches("[data-ds-component], [data-ds-region]")) depth += 1;
      }
      box.style.setProperty("--depth", String(depth));
    }

    setCensus({
      system: root.querySelectorAll("[data-ds-component]:not([data-ds-local])").length,
      local: root.querySelectorAll("[data-ds-local]").length,
      regions: root.querySelectorAll("[data-ds-region]").length,
    });
  }, []);

  /* It separates when it is looked at, not when the page loads. An animation
     that has already finished by the time the reader scrolls to it is a static
     picture with a cost. */
  useEffect(() => {
    const node = scene.current;
    if (!node || separated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeparated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [separated]);

  /* Under prefers-reduced-motion the planes are simply apart from the start.
     The point of the drawing is that every layer is visible at once, and that
     survives losing the motion entirely — which is the test for whether an
     animation was carrying meaning or carrying itself. */
  const state = reduced ? styles.apart : separated ? styles.separating : styles.stacked;

  return (
    <section className={styles.wrap}>
      <Heading level={2} size="md">
        The page as a physical object
      </Heading>

      <Text tone="muted" measure>
        One three-quarter view, and every level of nesting on its own plane. It
        separates once, on its own, along one axis. Nothing here is steerable —
        the drawing either explains the page without instructions or it does not
        work.
      </Text>

      <div className={styles.scene} ref={scene}>
        {/* inert, not aria-hidden: the scene holds real, focusable Buttons, and
            hiding them from a screen reader while leaving them in the tab order
            is a defect of its own. The census below carries the meaning. */}
        <div key={run} ref={stage} className={`${styles.stage} ${state}`} inert>
          <div className={styles.identity} {...region("Identity")}>
            <Display size="sm" as="span">
              Fabián Alcalá
            </Display>
            <Label size="md" tone="muted">
              Senior User Interface Engineer
            </Label>
            <Badge tone="accent" shape="pill" dot>
              Open to lead roles
            </Badge>
          </div>

          <ul className={styles.stats} {...region("Stats")}>
            <Stat value="6 years" label="in software" />
            <Stat value="14 months" label="associate → engineer" />
          </ul>

          <div className={styles.links} {...region("Links")}>
            <Button size="sm">Read the full profile</Button>
            <Button size="sm" variant="outline">
              Design system
            </Button>
          </div>
        </div>
      </div>

      {/* The one control, and it is not a camera: it re-runs the separation.
          Hidden from nobody, useful to anyone who looked away — and pointless
          under reduced motion, where the planes never came together. */}
      {reduced ? null : (
        <p>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSeparated(false);
              setRun((count) => count + 1);
              /* The remount resets the elements to stacked; the observer picks
                 it up again on the next frame because the scene is on screen. */
            }}
          >
            Separate again
          </Button>
        </p>
      )}

      <dl className={styles.census}>
        <div className={styles.figure}>
          <dt>
            <Label size="xs" caps tone="subtle">
              From the system
            </Label>
          </dt>
          <dd>
            <Display size="xs" as="span">
              {census.system}
            </Display>
          </dd>
        </div>
        <div className={styles.figure}>
          <dt>
            <Label size="xs" caps tone="subtle">
              One-offs
            </Label>
          </dt>
          <dd>
            <Display size="xs" as="span">
              {census.local}
            </Display>
          </dd>
        </div>
        <div className={styles.figure}>
          <dt>
            <Label size="xs" caps tone="subtle">
              Page markup
            </Label>
          </dt>
          <dd>
            <Display size="xs" as="span">
              {census.regions}
            </Display>
          </dd>
        </div>
      </dl>

      <Text size="sm" tone="muted" measure>
        {census.system + census.local === 0
          ? "Counting."
          : `${Math.round((census.system / (census.system + census.local)) * 100)}% of the boxes came from the system. That ratio is what a design system is actually judged on, and it is the one number a flat wireframe makes you count by hand.`}
      </Text>

      <Heading level={3} size="sm">
        What is wrong with it
      </Heading>
      <ul className={styles.notes}>
        <li>
          <Text size="sm" tone="muted" as="span">
            The census counts the scene, not the cover. It is the honest number
            for what is on screen and a dishonest one for the site, and the
            difference is the kind of thing a demo quietly gets away with.
          </Text>
        </li>
        <li>
          <Text size="sm" tone="muted" as="span">
            One angle means one set of collisions. At this rotation the identity
            block passes behind the stats, and no reader can move to see round
            it — the price of not making it steerable, paid once by everyone.
          </Text>
        </li>
        <li>
          <Text size="sm" tone="muted" as="span">
            An inline component has no plane. A span that fragments across two
            line boxes has no rectangle to lift, so it stays with its paragraph:
            the same conclusion the flat x-ray reached, arrived at again from the
            other direction.
          </Text>
        </li>
      </ul>
    </section>
  );
}
