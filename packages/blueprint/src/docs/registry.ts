import { alertDoc } from "../components/Alert/Alert.docs";
import { badgeDoc } from "../components/Badge/Badge.docs";
import { buttonDoc } from "../components/Button/Button.docs";
import { chipDoc } from "../components/Chip/Chip.docs";
import { codeDoc } from "../components/Code/Code.docs";
import { displayDoc } from "../components/Display/Display.docs";
import { headingDoc } from "../components/Heading/Heading.docs";
import { labelDoc } from "../components/Label/Label.docs";
import { linkDoc } from "../components/Link/Link.docs";
import { tableDoc } from "../components/Table/Table.docs";
import { tabsDoc } from "../components/Tabs/Tabs.docs";
import { textDoc } from "../components/Text/Text.docs";
import { toggleDoc } from "../components/Toggle/Toggle.docs";
import { visuallyHiddenDoc } from "../components/VisuallyHidden/VisuallyHidden.docs";
import type { ComponentCategory, ComponentDoc } from "./types";

/**
 * Every documented component. The docs page and its nav are built from this.
 *
 * There is no second tier. The cover and the profile are built entirely from
 * this list — nothing on either page is a one-off living outside the system,
 * and an e2e test asserts it by counting the elements the x-ray marks as local.
 * Which is why RotatingHeadline and StackRail sit here next to Button: they are
 * specific, but specific is not the same as outside the system, and a component
 * nobody documented is a component nobody can reuse.
 */
export const registry: readonly ComponentDoc[] = [
  buttonDoc,
  toggleDoc,
  chipDoc,
  badgeDoc,
  tableDoc,
  tabsDoc,
  linkDoc,
  alertDoc,
  headingDoc,
  displayDoc,
  textDoc,
  labelDoc,
  codeDoc,
  visuallyHiddenDoc,
];

export const CATEGORY_ORDER: readonly ComponentCategory[] = [
  "Actions",
  "Data display",
  "Navigation",
  "Feedback",
  "Typography",
  "Foundations",
];

export const byCategory = (): ReadonlyArray<readonly [ComponentCategory, readonly ComponentDoc[]]> =>
  CATEGORY_ORDER.map(
    (category) => [category, registry.filter((doc) => doc.category === category)] as const,
  ).filter(([, docs]) => docs.length > 0);
