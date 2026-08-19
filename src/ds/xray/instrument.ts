/**
 * Stamps a component so x-ray can find it and describe it.
 *
 * Every design system component spreads the result onto its root element. The
 * attributes are inert until x-ray is switched on — no wrapper element, no extra
 * DOM node, nothing that changes layout when the mode is off. That constraint is
 * why this is attributes rather than a <XRay> wrapper component: a wrapper would
 * add a box to every component in the tree, and the blueprint would then be
 * describing itself rather than the page.
 */

export type XRayProps = {
  "data-ds-component": string;
  "data-ds-props"?: string;
};

const PRINTABLE = new Set(["string", "number", "boolean"]);

/**
 * `variant="primary" size="md"`. Values that cannot be shown as a short literal
 * — children, render props, event handlers — are omitted rather than printed as
 * "[object Object]", and `false`/`undefined` are dropped because an absent
 * boolean prop is not information.
 */
export function formatProps(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== false && value !== "")
    .filter(([, value]) => PRINTABLE.has(typeof value))
    .map(([key, value]) => (value === true ? key : `${key}="${String(value)}"`))
    .join(" ");
}

export function xray(component: string, props: Record<string, unknown> = {}): XRayProps {
  const formatted = formatProps(props);
  return {
    "data-ds-component": component,
    ...(formatted ? { "data-ds-props": formatted } : {}),
  };
}

export type XRayLocalProps = XRayProps & {
  "data-ds-local": "";
};

/**
 * Stamps a component that is real, but is not part of the design system.
 *
 * RotatingHeadline, StackRail, StatusPill and the rest live in src/components:
 * they are components, with props and a box, and the blueprint should draw them
 * as such. What it must not do is draw them *identically* to a Display or a
 * Text, because that is a claim — that the system is responsible for this box —
 * and it is false. They lose the registration marks and their name is set in the
 * muted ink; the marks are what says "this one came from Blueprint".
 *
 * Three tiers, and the drawing is only worth reading if it keeps them apart:
 * xray() is the system, local() is a one-off component, region() is markup that
 * is not a component at all.
 */
export function local(component: string, props: Record<string, unknown> = {}): XRayLocalProps {
  return { ...xray(component, props), "data-ds-local": "" };
}

export type XRayRegionProps = {
  "data-ds-region": string;
};

/**
 * Stamps a block of page markup that is *not* a design system component.
 *
 * The blueprint draws these differently on purpose — dashed, unlabelled at the
 * corner, no registration marks — and the difference is the most useful thing
 * on the page. A solid frame is something the system is responsible for. A
 * dashed one is bespoke markup that has not earned a component yet, and being
 * able to see the ratio at a glance is worth more than a coverage number
 * nobody recomputes.
 *
 * Deliberately a separate attribute rather than xray("Stats"): claiming a page
 * div is a system component would make the blueprint lie about the thing it
 * exists to show.
 */
export function region(name: string): XRayRegionProps {
  return { "data-ds-region": name };
}
