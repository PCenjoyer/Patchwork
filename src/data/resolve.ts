import type { Language } from '../i18n/translations';
import type {
  BlockDefinition,
  LocalizedBlockDefinition,
  LocalizedTemplate,
  LocalizedVariableDefinition,
  Template,
  VariableDefinition,
} from '../types';

function resolveVar(v: LocalizedVariableDefinition, lang: Language): VariableDefinition {
  return {
    key: v.key,
    label: v.label[lang],
    type: v.type,
    required: v.required,
    placeholder: v.placeholder?.[lang],
    description: v.description?.[lang],
  };
}

function resolveBlock(b: LocalizedBlockDefinition, lang: Language, categoryLabel: string): BlockDefinition {
  return {
    id: b.id,
    title: b.title[lang],
    description: b.description[lang],
    body: b.body[lang],
    category: categoryLabel,
    variables: b.variables.map((v) => resolveVar(v, lang)),
    condition: b.condition,
    required: b.required,
  };
}

export function resolveTemplate(
  loc: LocalizedTemplate,
  lang: Language,
  categoryLabel: string,
): Template {
  return {
    id: loc.id,
    name: loc.name[lang],
    description: loc.description[lang],
    category: loc.category,
    estimatedMinutes: loc.estimatedMinutes,
    blockIds: loc.blockIds,
    blocks: loc.blocks.map((b) => resolveBlock(b, lang, categoryLabel)),
    globalVariables: loc.globalVariables.map((v) => resolveVar(v, lang)),
  };
}
