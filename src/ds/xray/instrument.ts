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
