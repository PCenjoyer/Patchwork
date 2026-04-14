// Core domain types for Patchwork document builder

export type VariableType = 'text' | 'number' | 'date' | 'currency' | 'email' | 'longtext';

export type LocalizedString = { ru: string; en: string };

export interface VariableDefinition {
  key: string;
  label: string;
  type: VariableType;
  required?: boolean;
  placeholder?: string;
  description?: string;
}

export interface LocalizedVariableDefinition {
  key: string;
  label: LocalizedString;
  type: VariableType;
  required?: boolean;
  placeholder?: LocalizedString;
  description?: LocalizedString;
}

export interface BlockCondition {
  variable: string;
  equals: (string | number | boolean)[];
}

export interface BlockDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  body: string;
  variables: VariableDefinition[];
  condition?: BlockCondition;
  required?: boolean;
}

export interface LocalizedBlockDefinition {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  body: LocalizedString;
  variables: LocalizedVariableDefinition[];
  condition?: BlockCondition;
  required?: boolean;
}

export type TemplateCategoryKey = 'nda' | 'lease' | 'offer' | 'service' | 'freelance' | 'invoice';

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  category: TemplateCategoryKey;
  estimatedMinutes: number;
}

export interface Template extends TemplateMeta {
  blockIds: string[];
  blocks: BlockDefinition[];
  globalVariables: VariableDefinition[];
}

export interface LocalizedTemplate {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TemplateCategoryKey;
  estimatedMinutes: number;
  blockIds: string[];
  blocks: LocalizedBlockDefinition[];
  globalVariables: LocalizedVariableDefinition[];
}

export interface DocumentBlockInstance {
  instanceId: string;
  definitionId: string;
}

export interface DocumentState {
  id: string | null;
  templateId: string;
  title: string;
  blocks: DocumentBlockInstance[];
  values: Record<string, string | number>;
  updatedAt: number;
}

export interface DocumentSnapshot {
  blocks: DocumentBlockInstance[];
  values: Record<string, string | number>;
  title: string;
}
