import type { DocumentBlockInstance, DocumentSnapshot, DocumentState, Template } from '../types';

// Reducer action shapes — every mutation flows through these.
export type DocumentAction =
  | { type: 'INIT_FROM_TEMPLATE'; template: Template; instanceFactory: () => string }
  | { type: 'UPDATE_TEMPLATE'; template: Template }
  | { type: 'LOAD_DOCUMENT'; doc: DocumentState }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_VALUE'; key: string; value: string | number }
  | { type: 'ADD_BLOCK'; definitionId: string; index?: number; instanceId: string }
  | { type: 'REMOVE_BLOCK'; instanceId: string }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'MARK_SAVED'; id: string };

export interface DocumentStoreState {
  // Active document being edited.
  doc: DocumentState;
  // Active template definition (drives blocks/variables).
  template: Template;
  // Past/future snapshots for undo/redo. Snapshot only stores user-mutable state.
  past: DocumentSnapshot[];
  future: DocumentSnapshot[];
  // Tracks unsaved changes for save indicators.
  dirty: boolean;
  // Coalescence cursor: the last text-like mutation. Used to fold consecutive edits of the
  // same field/title into a single undo step so every keystroke doesn't clone the whole doc.
  lastEdit?: { kind: 'title' | 'value'; key?: string; at: number };
}

const HISTORY_LIMIT = 100;
// Consecutive edits to the same field/title within this window share one undo snapshot.
const COALESCE_WINDOW_MS = 600;

function snapshot(doc: DocumentState): DocumentSnapshot {
  return {
    blocks: doc.blocks.map((b) => ({ ...b })),
    values: { ...doc.values },
    title: doc.title,
  };
}

function applySnapshot(doc: DocumentState, snap: DocumentSnapshot): DocumentState {
  return {
    ...doc,
    blocks: snap.blocks.map((b) => ({ ...b })),
    values: { ...snap.values },
    title: snap.title,
    updatedAt: Date.now(),
  };
}

// Mutation actions are subject to undo/redo; navigation ones (init/load/save) are not.
const UNDOABLE = new Set<DocumentAction['type']>([
  'SET_TITLE',
  'SET_VALUE',
  'ADD_BLOCK',
  'REMOVE_BLOCK',
  'MOVE_BLOCK',
]);

export function buildInitialState(template: Template, instanceFactory: () => string): DocumentStoreState {
  const blocks: DocumentBlockInstance[] = template.blockIds.map((defId) => ({
    instanceId: instanceFactory(),
    definitionId: defId,
  }));
  const doc: DocumentState = {
    id: null,
    templateId: template.id,
    title: template.name,
    blocks,
    values: {},
    updatedAt: Date.now(),
  };
  return { doc, template, past: [], future: [], dirty: false };
}

// Decide whether this action should extend the most recent text-edit streak rather than
// push a new history entry. Structural changes (add/remove/move) always break the streak.
function coalesceTarget(action: DocumentAction): { kind: 'title' | 'value'; key?: string } | null {
  if (action.type === 'SET_TITLE') return { kind: 'title' };
  if (action.type === 'SET_VALUE') return { kind: 'value', key: action.key };
  return null;
}

export function documentReducer(state: DocumentStoreState, action: DocumentAction): DocumentStoreState {
  // Snapshot before any user-driven mutation.
  const pushHistory = (s: DocumentStoreState): { past: DocumentSnapshot[]; future: DocumentSnapshot[] } => {
    const past = [...s.past, snapshot(s.doc)];
    if (past.length > HISTORY_LIMIT) past.shift();
    return { past, future: [] };
  };

  if (UNDOABLE.has(action.type)) {
    const target = coalesceTarget(action);
    const now = Date.now();
    const last = state.lastEdit;
    const canCoalesce =
      !!target &&
      !!last &&
      last.kind === target.kind &&
      last.key === target.key &&
      now - last.at < COALESCE_WINDOW_MS;

    if (canCoalesce) {
      // Extend the existing streak: keep past/future as-is, just bump the cursor.
      state = { ...state, dirty: true, lastEdit: { ...target!, at: now } };
    } else {
      state = {
        ...state,
        ...pushHistory(state),
        dirty: true,
        lastEdit: target ? { ...target, at: now } : undefined,
      };
    }
  }

  switch (action.type) {
    case 'INIT_FROM_TEMPLATE':
      return buildInitialState(action.template, action.instanceFactory);

    case 'UPDATE_TEMPLATE':
      // Language/content swap only — document values, block order, history all preserved.
      return { ...state, template: action.template };

    case 'LOAD_DOCUMENT':
      return {
        doc: action.doc,
        template: state.template,
        past: [],
        future: [],
        dirty: false,
      };

    case 'SET_TITLE':
      return {
        ...state,
        doc: { ...state.doc, title: action.title, updatedAt: Date.now() },
      };

    case 'SET_VALUE':
      return {
        ...state,
        doc: {
          ...state.doc,
          values: { ...state.doc.values, [action.key]: action.value },
          updatedAt: Date.now(),
        },
      };

    case 'ADD_BLOCK': {
      const inst: DocumentBlockInstance = { instanceId: action.instanceId, definitionId: action.definitionId };
      const idx = action.index ?? state.doc.blocks.length;
      const next = [...state.doc.blocks];
      next.splice(idx, 0, inst);
      return { ...state, doc: { ...state.doc, blocks: next, updatedAt: Date.now() } };
    }

    case 'REMOVE_BLOCK': {
      const next = state.doc.blocks.filter((b) => b.instanceId !== action.instanceId);
      return { ...state, doc: { ...state.doc, blocks: next, updatedAt: Date.now() } };
    }

    case 'MOVE_BLOCK': {
      const { fromIndex, toIndex } = action;
      if (fromIndex === toIndex) return state;
      const next = [...state.doc.blocks];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...state, doc: { ...state.doc, blocks: next, updatedAt: Date.now() } };
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const past = [...state.past];
      const prev = past.pop()!;
      const future = [snapshot(state.doc), ...state.future];
      return {
        ...state,
        doc: applySnapshot(state.doc, prev),
        past,
        future,
        dirty: true,
        lastEdit: undefined,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      const past = [...state.past, snapshot(state.doc)];
      return {
        ...state,
        doc: applySnapshot(state.doc, next),
        past,
        future: rest,
        dirty: true,
        lastEdit: undefined,
      };
    }

    case 'MARK_SAVED':
      return {
        ...state,
        doc: { ...state.doc, id: action.id },
        dirty: false,
      };

    default:
      return state;
  }
}
