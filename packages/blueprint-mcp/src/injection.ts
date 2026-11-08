/**
 * Prompt-injection patterns for text that reaches a model through this server: tool
 * descriptions, the server's instructions, and every string in the manifest (component
 * guidance and token comments come from the docs, which anyone can propose a change to).
 *
 * Based on published MCP attacks: tool poisoning with hidden <IMPORTANT> blocks, requests
 * to read credentials, "ignore previous instructions", tool shadowing, exfiltration URLs,
 * and ASCII smuggling with invisible Unicode tag characters.
 */
export type InjectionHit = { rule: string; excerpt: string };

/* Hosts the docs may link to. Anything else in agent-facing text is a finding. */
const ALLOWED_HOSTS = new Set([
  "fabiannabi.github.io",
  "github.com",
  "www.w3.org",
  "w3.org",
  "modelcontextprotocol.io",
  "developer.mozilla.org",
  "json-schema.org", // the $schema of every tool input schema
]);

const RULES: { rule: string; re: RegExp }[] = [
  { rule: "hidden-directive-tag", re: /<\s*\/?\s*(important|system|instructions?|secret|admin|override)\b[^>]*>/i },
  { rule: "override-instructions", re: /\b(ignore|disregard|forget|override)\b[^.\n]{0,40}\b(previous|prior|above|earlier|system|all)\b[^.\n]{0,20}\b(instructions?|prompts?|messages?|rules?)\b/i },
  { rule: "conceal-from-user", re: /\b(do not|don't|never|without)\b[^.\n]{0,30}\b(tell|inform|show|mention|notify|alert)(ing)?\b[^.\n]{0,15}\buser\b/i },
  { rule: "credential-path", re: /(~\/\.ssh|\bid_(rsa|ed25519|ecdsa)\b|\.aws\/credentials|\.npmrc|\.netrc|\.git-credentials|(^|[\s"'`(/])\.env\b|mcp\.json|claude_desktop_config|\.claude\.json|\/etc\/passwd|\bkeychain\b)/i },
  { rule: "secret-request", re: /\b(api[_ -]?key|access[_ -]?token|private[_ -]?key|password|secret|credentials?)\b[^.\n]{0,40}\b(send|include|pass|append|read|upload|post|forward|paste)\b|\b(send|include|pass|append|read|upload|post|forward)\b[^.\n]{0,40}\b(api[_ -]?key|access[_ -]?token|private[_ -]?key|password|credentials?)\b/i },
  { rule: "tool-shadowing", re: /\b(when|whenever|before|after)\b[^.\n]{0,40}\b(other|another|any)\b[^.\n]{0,20}\b(tool|server|mcp)s?\b/i },
  { rule: "role-marker", re: /(^|\n)\s*(system|assistant|developer)\s*:/i },
  { rule: "shell-command", re: /\b(curl|wget|bash -c|sh -c|powershell|Invoke-WebRequest|eval\(|child_process|rm -rf)\b/i },
  { rule: "invisible-unicode", re: /[​-‏‪-‮⁠-⁤﻿]|[\u{E0000}-\u{E007F}]/u },
  { rule: "encoded-blob", re: /[A-Za-z0-9+/]{120,}={0,2}/ },
];

export function findInjection(text: string): InjectionHit[] {
  const hits: InjectionHit[] = [];
  for (const { rule, re } of RULES) {
    const m = re.exec(text);
    if (m) hits.push({ rule, excerpt: excerpt(text, m.index, m[0].length) });
  }
  for (const m of text.matchAll(/\b(?:https?|ftp|wss?):\/\/([^/\s"'`)<>]+)/gi)) {
    const host = (m[1] ?? "").toLowerCase().replace(/:\d+$/, "");
    if (!ALLOWED_HOSTS.has(host)) hits.push({ rule: "unknown-url", excerpt: excerpt(text, m.index ?? 0, m[0].length) });
  }
  return hits;
}

/** Every string inside a value, with the path it was found at. */
export function* strings(value: unknown, path = "$"): Generator<[string, string]> {
  if (typeof value === "string") yield [path, value];
  else if (Array.isArray(value)) for (const [i, v] of value.entries()) yield* strings(v, `${path}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) { yield [`${path}.${k} (key)`, k]; yield* strings(v, `${path}.${k}`); }
}

const excerpt = (text: string, at: number, len: number): string =>
  JSON.stringify(text.slice(Math.max(0, at - 20), at + len + 20));
