import { useEffect } from 'react';

interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

// Wires Ctrl/Cmd-based shortcuts at the document level.
// Skips events whose target is an editable element to avoid hijacking native undo in inputs.
export function useKeyboardShortcuts({ onUndo, onRedo, onSave }: ShortcutHandlers) {
  useEffect(() => {
    function isEditable(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (target.isContentEditable) return true;
      return false;
    }
    function handler(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      const key = e.key.toLowerCase();

      if (key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }
      // Undo/Redo: only when not focused inside an editable element so the user can still
      // undo their typing within an input/textarea.
      if (isEditable(e.target)) return;

      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        onRedo?.();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onUndo, onRedo, onSave]);
}
