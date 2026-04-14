import type { BlockDefinition, DocumentBlockInstance, Template, VariableDefinition } from '../types';
import type { Language } from '../i18n/translations';

const PLACEHOLDER_RE = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

export type Token =
  | { kind: 'text'; value: string }
  | { kind: 'placeholder'; key: string };

export function tokenize(body: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  for (const match of body.matchAll(PLACEHOLDER_RE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      tokens.push({ kind: 'text', value: body.slice(lastIndex, start) });
    }
    tokens.push({ kind: 'placeholder', key: match[1] });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < body.length) {
    tokens.push({ kind: 'text', value: body.slice(lastIndex) });
  }
  return tokens;
}

export function extractPlaceholders(body: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const match of body.matchAll(PLACEHOLDER_RE)) {
    const key = match[1];
    if (!seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}

interface FormatOptions {
  lang?: Language;
}

const CURRENCY_BY_LANG: Record<Language, { locale: string; currency: string }> = {
  ru: { locale: 'ru-RU', currency: 'RUB' },
  en: { locale: 'en-US', currency: 'USD' },
};

export function formatValue(
  def: VariableDefinition | undefined,
  raw: string | number | undefined,
  options: FormatOptions = {},
): string {
  if (raw === undefined || raw === null || raw === '') return '';
  if (!def) return String(raw);
  const lang = options.lang ?? 'en';
  switch (def.type) {
    case 'currency': {
      const num = typeof raw === 'number' ? raw : Number(raw);
      if (!Number.isFinite(num)) return String(raw);
      const { locale, currency } = CURRENCY_BY_LANG[lang];
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(num);
    }
    case 'date': {
      const s = String(raw);
      const parts = s.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts.map((p) => Number(p));
        if (Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d)) {
          const dt = new Date(Date.UTC(y, m - 1, d));
          const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
          return dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
        }
      }
      return s;
    }
    case 'number':
      return String(raw);
    default:
      return String(raw);
  }
}

export function renderBody(
  body: string,
  variables: Record<string, VariableDefinition>,
  values: Record<string, string | number>,
  options: { highlightMissing?: boolean; lang?: Language } = {},
): string {
  return body.replace(PLACEHOLDER_RE, (_, key: string) => {
    const def = variables[key];
    const raw = values[key];
    const formatted = formatValue(def, raw, { lang: options.lang });
    if (formatted === '') {
      return options.highlightMissing ? `[${def?.label ?? key}]` : `{{${key}}}`;
    }
    return formatted;
  });
}

export function collectAllVariables(template: Template): VariableDefinition[] {
  const map = new Map<string, VariableDefinition>();
  for (const v of template.globalVariables) {
    map.set(v.key, v);
  }
  for (const block of template.blocks) {
    for (const v of block.variables) {
      if (!map.has(v.key)) map.set(v.key, v);
    }
  }
  return Array.from(map.values());
}

export function collectActiveVariables(
  template: Template,
  instances: DocumentBlockInstance[],
  values: Record<string, string | number>,
): VariableDefinition[] {
  const allVars = new Map<string, VariableDefinition>();
  for (const v of template.globalVariables) allVars.set(v.key, v);
  for (const block of template.blocks) {
    for (const v of block.variables) if (!allVars.has(v.key)) allVars.set(v.key, v);
  }

  const active = new Map<string, VariableDefinition>();
  for (const v of template.globalVariables) active.set(v.key, v);

  const defById = new Map(template.blocks.map((b) => [b.id, b] as const));
  for (const inst of instances) {
    const def = defById.get(inst.definitionId);
    if (!def) continue;
    if (!isBlockVisible(def, values)) continue;
    for (const key of extractPlaceholders(def.body)) {
      const v = allVars.get(key);
      if (v && !active.has(key)) active.set(key, v);
    }
  }
  return Array.from(active.values());
}

export function isBlockVisible(def: BlockDefinition, values: Record<string, string | number>): boolean {
  if (!def.condition) return true;
  const raw = values[def.condition.variable];
  if (raw === undefined || raw === null || raw === '') return false;
  return def.condition.equals.some((v) => String(v).toLowerCase() === String(raw).toLowerCase().trim());
}
