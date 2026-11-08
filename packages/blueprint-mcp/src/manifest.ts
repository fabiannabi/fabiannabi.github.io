import { readFileSync } from "node:fs";

/** The shape of @fabiannabi/blueprint's dist/manifest.json. */
export type PropDoc = {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly required?: boolean;
  readonly description: string;
};

export type ComponentEntry = {
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly summary: string;
  readonly anatomy?: readonly string[];
  readonly props: readonly PropDoc[];
  readonly accessibility: readonly string[];
  readonly guidance: { readonly do: readonly string[]; readonly dont: readonly string[] };
  readonly import: string;
};

export type ThemeValue = { readonly value: string | null; readonly primitive: string | null };

export type TokenEntry = {
  readonly name: string;
  readonly layer: "primitive" | "semantic" | "scale";
  readonly group: string;
  readonly value?: string;
  readonly step?: number | null;
  readonly themes?: Readonly<Record<string, ThemeValue>>;
  readonly comment?: string;
};

export type Manifest = {
  readonly name: string;
  readonly generated: string;
  readonly themes: readonly string[];
  readonly rules: readonly string[];
  readonly components: readonly ComponentEntry[];
  readonly tokens: readonly TokenEntry[];
};

export function loadManifest(path: string): Manifest {
  return JSON.parse(readFileSync(path, "utf8")) as Manifest;
}
