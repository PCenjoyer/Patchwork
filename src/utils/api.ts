import { v4 as uuid } from 'uuid';
import type { DocumentState, Template, TemplateMeta } from '../types';
import { resolveAllTemplates, resolveTemplateById } from '../data/templates';
import type { Language } from '../i18n/translations';

const STORAGE_KEY = 'patchwork.documents.v1';

interface StoredDocuments {
  [id: string]: DocumentState;
}

function readStore(): StoredDocuments {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as StoredDocuments;
  } catch {
    // Corrupted storage — fall back to empty.
  }
  return {};
}

function writeStore(store: StoredDocuments): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export const api = {
  listTemplates(lang: Language): TemplateMeta[] {
    return resolveAllTemplates(lang).map(({ id, name, description, category, estimatedMinutes }) => ({
      id,
      name,
      description,
      category,
      estimatedMinutes,
    }));
  },

  getTemplate(id: string, lang: Language): Template | null {
    return resolveTemplateById(id, lang);
  },

  createDocument(doc: DocumentState): DocumentState {
    const id = uuid();
    const saved: DocumentState = { ...doc, id, updatedAt: Date.now() };
    const store = readStore();
    store[id] = saved;
    writeStore(store);
    return saved;
  },

  updateDocument(doc: DocumentState): DocumentState {
    if (!doc.id) throw new Error('updateDocument requires a document id');
    const saved: DocumentState = { ...doc, updatedAt: Date.now() };
    const store = readStore();
    store[doc.id] = saved;
    writeStore(store);
    return saved;
  },

  getDocument(id: string): DocumentState | null {
    const store = readStore();
    return store[id] ?? null;
  },

  listDocuments(): DocumentState[] {
    const store = readStore();
    return Object.values(store).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  deleteDocument(id: string): void {
    const store = readStore();
    delete store[id];
    writeStore(store);
  },
};
