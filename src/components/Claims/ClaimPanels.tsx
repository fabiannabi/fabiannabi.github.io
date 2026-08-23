import { Label } from "../../ds/components/Label/Label";
import { Text } from "../../ds/components/Text/Text";
import { local } from "../../ds/xray/instrument";
import type { ClaimModel } from "./model";
import styles from "./ClaimPanels.module.css";

type Props = {
  lead: string;
  claims: readonly ClaimModel[];
};

/**
 * Presentation A — a panel each.
 *
 * The instruments used to live in the page chrome, where they were the most
 * unusual thing on the site and read as furniture: a control with no sentence
 * attached has no context but its own label. Here the context is structural —
 * the control sits inside the claim and cannot be found without reading why it
 * exists.
 *
 * What it costs: two cards of vertical space, and a block that reads as a
 * widget grid rather than as part of the page's argument. That is the trade
 * the other two presentations are trying to beat.
 */
export function ClaimPanels({ lead, claims }: Props) {
  return (
    <div className={styles.grid}>
      <div className={styles.lead}>
        <Label size="sm" caps tone="subtle">
          {lead}
        </Label>
      </div>

      {claims.map((claim) => (
        <Panel key={claim.key} claim={claim} />
      ))}
    </div>
  );
}

/**
 * A panel, not a row. The first version was a sentence with a control under it
 * and nothing else, which reads as a form field and gives no sign that pressing
 * it does anything. The border is the affordance: quiet at rest, accent once the
 * claim is settled.
 *
 * The answer is sized by a hidden copy of every line it can hold, so settling a
 * claim never moves the page. A demonstration about visual care cannot afford a
 * layout shift in the middle of itself.
 */
function Panel({ claim }: { claim: ClaimModel }) {
  return (
    <div
      className={claim.settled ? `${styles.claim} ${styles.settled}` : styles.claim}
      {...local("Claim", { settled: claim.settled })}
    >
      {/* `data-ds-chrome`, the same exemption the x-ray's own switch carries.
          A card whose job is to explain an instrument cannot be blanked by the
          instrument. The cover does not ship the blueprint at all now, and this
          stays because the profile could show a claim tomorrow. */}
      <div data-ds-chrome="">
        <Text size="sm" weight="medium">
          {claim.claim}
        </Text>
      </div>

      {/* `inert`, not `aria-hidden`. The specimen holds real components and one
          of them is a real Button — aria-hidden over a focusable element is a
          violation in its own right, and leaves a control in the tab order that
          a screen reader has been told does not exist. inert removes it from
          both. The sentence and the answer carry everything it shows. */}
      {/* One wrapper per piece, so a presentation can place them itself without
          reaching into the components the claim handed over. */}
      <div className={styles.specimen} inert>
        {claim.specimen.map((piece, index) => (
          <span key={index} className={styles.piece}>
            {piece}
          </span>
        ))}
      </div>

      <div className={styles.instrument}>{claim.instrument}</div>

      <div className={styles.answer}>
        <div className={styles.sizer} aria-hidden="true">
          {claim.answers.map((line) => (
            <Label key={line} size="md" tone="subtle">
              {line}
            </Label>
          ))}
        </div>
        <div aria-live="polite" data-ds-chrome="">
          <Label size="md" tone={claim.settled ? "muted" : "subtle"}>
            {claim.answer}
          </Label>
        </div>
      </div>
    </div>
  );
}
