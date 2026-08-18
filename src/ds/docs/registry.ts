import { alertDoc } from "../components/Alert/Alert.docs";
import { badgeDoc } from "../components/Badge/Badge.docs";
import { buttonDoc } from "../components/Button/Button.docs";
import { chipDoc } from "../components/Chip/Chip.docs";
import { codeDoc } from "../components/Code/Code.docs";
import { headingDoc } from "../components/Heading/Heading.docs";
import { tabsDoc } from "../components/Tabs/Tabs.docs";
import { textDoc } from "../components/Text/Text.docs";
import type { ComponentCategory, ComponentDoc } from "./types";

/** Every documented component. The docs page and its nav are built from this. */
export const registry: readonly ComponentDoc[] = [
  buttonDoc,
  chipDoc,
  badgeDoc,
  tabsDoc,
  alertDoc,
  headingDoc,
  textDoc,
  codeDoc,
];

export const CATEGORY_ORDER: readonly ComponentCategory[] = [
  "Actions",
  "Data display",
  "Navigation",
  "Feedback",
  "Typography",
];

export const byCategory = (): ReadonlyArray<readonly [ComponentCategory, readonly ComponentDoc[]]> =>
  CATEGORY_ORDER.map(
    (category) => [category, registry.filter((doc) => doc.category === category)] as const,
  ).filter(([, docs]) => docs.length > 0);
