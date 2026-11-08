import type { ComponentEntry, Manifest, TokenEntry } from "./manifest.js";

export function listComponents(m: Manifest): { name: string; category: string; summary: string }[] {
  return m.components.map(({ name, category, summary }) => ({ name, category, summary }));
}

/** Case-insensitive lookup by name or slug. */
export function getComponent(m: Manifest, name: string): ComponentEntry | undefined {
  const key = name.trim().toLowerCase();
  return m.components.find((c) => c.name.toLowerCase() === key || c.slug === key);
}

/* Words people (and agents) use for an intent, mapped onto the token
   vocabulary. Spanish included: the author writes in both. */
const SYNONYMS: Record<string, string[]> = {
  danger: ["error", "errors", "destructive", "delete", "invalid", "failure", "fail", "peligro", "eliminar", "borrar"],
  success: ["ok", "valid", "done", "complete", "positive", "exito", "éxito", "correcto"],
  warning: ["warn", "caution", "attention", "advertencia", "aviso", "cuidado"],
  info: ["information", "notice", "neutral", "informacion", "información"],
  accent: ["primary", "brand", "highlight", "link", "focus", "acento", "primario", "marca", "enlace"],
  surface: ["background", "bg", "page", "card", "panel", "fondo", "superficie", "tarjeta"],
  text: ["foreground", "fg", "copy", "font", "label", "texto", "letra"],
  border: ["outline", "divider", "separator", "stroke", "borde", "linea", "línea"],
  space: ["spacing", "padding", "margin", "gap", "espacio", "espaciado", "margen"],
  radius: ["rounded", "corner", "corners", "radio", "esquina", "redondeo"],
  muted: ["secondary", "subtle", "soft", "dim", "secundario", "tenue"],
  raised: ["elevated", "card", "elevado"],
  overlay: ["popover", "menu", "dialog", "modal"],
  contrast: ["on", "inverse", "over", "sobre"],
  hover: ["hovered", "pointer"],
  strong: ["interactive", "control", "fuerte"],
};

const ROLES = new Set(["danger", "success", "warning", "info", "accent"]);

const normalize = (s: string): string => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function expand(query: string): Set<string> {
  const words = normalize(query).split(/[^a-z0-9]+/).filter(Boolean);
  const out = new Set(words);
  for (const w of words) {
    for (const [canon, syns] of Object.entries(SYNONYMS)) {
      if (w === canon || syns.map(normalize).includes(w)) out.add(canon);
    }
  }
  return out;
}

export type TokenMatch = TokenEntry & { score: number };

/**
 * Finds the token for an intent ("error text", "color de fondo de tarjeta").
 * Semantic tokens always outrank primitives: an agent asking for "red" should
 * be told about --ds-danger, not --ds-rose-400.
 */
export function findToken(m: Manifest, query: string, limit = 5): TokenMatch[] {
  const terms = expand(query);
  const scored = m.tokens.map((t) => {
    const parts = t.name.replace(/^--ds-/, "").split("-");
    const commentWords = new Set(normalize(t.comment ?? "").split(/[^a-z0-9]+/));
    let score = 0;
    for (const term of terms) {
      // the role a colour plays (danger, accent…) decides the token; "text" or "border" only refines it
      if (parts.includes(term)) score += ROLES.has(term) ? 4 : 3;
      else if (term.length > 3 && t.name.includes(term)) score += 1;
      if (term.length > 3 && commentWords.has(term)) score += 0.5;
    }
    if (score > 0) {
      if (t.layer === "semantic") score += 2;
      if (t.layer === "primitive") score -= 2.5;
      // every part of the name the query did not ask for makes it more specific than wanted
      score -= parts.filter((p) => !terms.has(p)).length * 0.9;
    }
    return { ...t, score: Math.round(score * 100) / 100 };
  });
  return scored.filter((t) => t.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}
