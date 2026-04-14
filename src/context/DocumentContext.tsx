import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import type { Template } from '../types';
import {
  buildInitialState,
  documentReducer,
  type DocumentAction,
  type DocumentStoreState,
} from './documentReducer';

interface DocumentContextValue {
  state: DocumentStoreState;
  dispatch: (action: DocumentAction) => void;
  // Convenience action creators for common UI flows.
  setTitle: (title: string) => void;
  setValue: (key: string, value: string | number) => void;
  addBlock: (definitionId: string, index?: number) => string;
  removeBlock: (instanceId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

export function DocumentProvider({ template, children }: { template: Template; children: ReactNode }) {
  const [state, dispatch] = useReducer(
    documentReducer,
    undefined,
    () => buildInitialState(template, () => uuid()),
  );

  const setTitle = useCallback((title: string) => dispatch({ type: 'SET_TITLE', title }), []);
  const setValue = useCallback(
    (key: string, value: string | number) => dispatch({ type: 'SET_VALUE', key, value }),
    [],
  );
  const addBlock = useCallback((definitionId: string, index?: number) => {
    const instanceId = uuid();
    dispatch({ type: 'ADD_BLOCK', definitionId, index, instanceId });
    return instanceId;
  }, []);
  const removeBlock = useCallback((instanceId: string) => dispatch({ type: 'REMOVE_BLOCK', instanceId }), []);
  const moveBlock = useCallback(
    (fromIndex: number, toIndex: number) => dispatch({ type: 'MOVE_BLOCK', fromIndex, toIndex }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const value: DocumentContextValue = useMemo(
    () => ({
      state,
      dispatch,
      setTitle,
      setValue,
      addBlock,
      removeBlock,
      moveBlock,
      undo,
      redo,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
    }),
    [state, setTitle, setValue, addBlock, removeBlock, moveBlock, undo, redo],
  );

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocument(): DocumentContextValue {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocument must be used within a DocumentProvider');
  return ctx;
}
