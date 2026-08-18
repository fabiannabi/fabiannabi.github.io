import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import styles from "./StackRail.module.css";

const BASE_SPEED = 26; // px per second
const TAU = 260; // ms — how long the glide takes to settle

type Props = { items: readonly string[] };

/**
 * Driven per frame rather than by a CSS animation: `animation-play-state` stops
 * dead, and the point of hovering is that it should glide to a halt. Speed eases
 * toward its target with exponential smoothing, which reads as momentum instead
 * of a switch.
 *
 * The list is rendered twice so the wrap is seamless — the track resets by
 * exactly half its width, which is a whole copy.
 */
export function StackRail({ items }: Props) {
  const reduced = usePrefersReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const track = trackRef.current;
    // Nothing in CSS can stop a rAF loop, so the flag is checked here too.
    if (reduced || !rail || !track) return;

    let half = 0;
    let offset = 0;
    let speed = BASE_SPEED;
    let target = BASE_SPEED;
    let last = 0;
    let frame = 0;

    const remeasure = (): void => {
      half = track.scrollWidth / 2;
    };
    remeasure();
    document.fonts?.ready.then(remeasure).catch(() => undefined);

    const onEnter = (): void => {
      target = 0;
    };
    const onLeave = (): void => {
      target = BASE_SPEED;
    };
    // Returning to a backgrounded tab must not jump by the whole elapsed time.
    const onVisibility = (): void => {
      last = 0;
    };

    window.addEventListener("resize", remeasure);
    rail.addEventListener("pointerenter", onEnter);
    rail.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const step = (now: number): void => {
      if (!last) last = now;
      const dt = Math.min(now - last, 50);
      last = now;

      // Exponential approach: fast at first, asymptotic at the end.
      speed += (target - speed) * (1 - Math.exp(-dt / TAU));

      offset += (speed * dt) / 1000;
      if (half && offset >= half) offset -= half;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", remeasure);
      rail.removeEventListener("pointerenter", onEnter);
      rail.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      track.style.transform = "";
    };
  }, [reduced]);

  return (
    <>
      <VisuallyHidden as="p">{`Stack: ${items.join(", ")}.`}</VisuallyHidden>
      <div className={styles.rail} ref={railRef} aria-hidden="true">
        <div className={styles.track} ref={trackRef}>
          {[0, 1].map((copy) =>
            items.map((item) => (
              <i key={`${copy}-${item}`} className={styles.item}>
                {item}
              </i>
            )),
          )}
        </div>
      </div>
    </>
  );
}
