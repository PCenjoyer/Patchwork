import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentProvider, useDocument } from '../context/DocumentContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { api } from '../utils/api';
import type { Template, DocumentState } from '../types';
import { BlockPalette } from '../components/builder/BlockPalette';
import { BlockList } from '../components/builder/BlockList';
import { PreviewPanel } from '../components/preview/PreviewPanel';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { buildPrintableHtml, downloadFile, openPrintWindow } from '../utils/export';
import styles from './BuilderPage.module.css';

export function BuilderPage() {
  const params = useParams<{ templateId?: string; documentId?: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [resolved, setResolved] = useState<{ template: Template; loadedDoc: DocumentState | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (params.templateId) {
      const tpl = api.getTemplate(params.templateId, lang);
      if (!tpl) {
        setError(t('builder.errorTemplate'));
        return;
      }
      setResolved({ template: tpl, loadedDoc: null });
    } else if (params.documentId) {
      const doc = api.getDocument(params.documentId);
      if (!doc) {
        setError(t('builder.errorDocument'));
        return;
      }
      const tpl = api.getTemplate(doc.templateId, lang);
      if (!tpl) {
        setError(t('builder.errorTemplateGone'));
        return;
      }
      setResolved({ template: tpl, loadedDoc: doc });
    } else {
      setError(t('builder.errorNoTarget'));
    }
    // We resolve once per URL change; language-driven re-resolution happens inside BuilderShell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.templateId, params.documentId]);

  if (error) {
    return (
      <div className={styles.errorState}>
        <h2>{t('builder.errorTitle')}</h2>
        <p>{error}</p>
        <button type="button" onClick={() => navigate('/')} className={styles.errorAction}>
          {t('builder.backToTemplates')}
        </button>
      </div>
    );
  }

  if (!resolved) return <div className={styles.loading}>{t('builder.loading')}</div>;

  return (
    <DocumentProvider template={resolved.template}>
      <BuilderShell loadedDoc={resolved.loadedDoc} templateId={resolved.template.id} />
    </DocumentProvider>
  );
}

interface ShellProps {
  loadedDoc: DocumentState | null;
  templateId: string;
}

function BuilderShell({ loadedDoc, templateId }: ShellProps) {
  const { state, dispatch, setTitle, undo, redo, canUndo, canRedo } = useDocument();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load persisted document once (by URL), independently of language.
  useEffect(() => {
    if (loadedDoc) {
      dispatch({ type: 'LOAD_DOCUMENT', doc: loadedDoc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedDoc]);

  // When language changes, re-resolve the active template so labels/bodies/placeholders
  // flip over. The reducer's UPDATE_TEMPLATE keeps document values, block order, and
  // undo history intact.
  useEffect(() => {
    const fresh = api.getTemplate(templateId, lang);
    if (fresh) dispatch({ type: 'UPDATE_TEMPLATE', template: fresh });
  }, [lang, templateId, dispatch]);

  // Keep a ref to the latest doc so handleSave is stable across keystrokes.
  // Otherwise the Ctrl+S shortcut effect re-subscribes a keydown listener on every edit.
  const docRef = useRef(state.doc);
  useEffect(() => {
    docRef.current = state.doc;
  }, [state.doc]);

  const handleSave = useCallback(() => {
    const doc = docRef.current;
    setSavingState('saving');
    try {
      if (doc.id) {
        api.updateDocument(doc);
        dispatch({ type: 'MARK_SAVED', id: doc.id });
      } else {
        const created = api.createDocument(doc);
        dispatch({ type: 'MARK_SAVED', id: created.id! });
        navigate(`/builder/${created.id}`, { replace: true });
      }
      setSavingState('saved');
      window.setTimeout(() => setSavingState('idle'), 1800);
    } catch {
      setSavingState('error');
    }
  }, [dispatch, navigate]);

  useKeyboardShortcuts({ onUndo: undo, onRedo: redo, onSave: handleSave });

  const handleExportHtml = () => {
    const html = buildPrintableHtml(state.template, state.doc, lang);
    const safeName = (state.doc.title || 'document').replace(/[^a-z0-9-_]+/gi, '_');
    downloadFile(`${safeName}.html`, html, 'text/html;charset=utf-8');
  };

  const handlePrintPdf = () => {
    const html = buildPrintableHtml(state.template, state.doc, lang);
    openPrintWindow(html);
  };

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')} aria-label={t('builder.backToTemplates')}>
            ←
          </button>
          <input
            className={styles.titleInput}
            value={state.doc.title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label={t('builder.docTitleAria')}
            placeholder={t('builder.untitled')}
          />
        </div>
        <div className={styles.toolbarRight}>
          <SaveIndicator state={savingState} dirty={state.dirty} />
          <button type="button" className={styles.iconBtn} onClick={undo} disabled={!canUndo} aria-label={t('builder.undo')} title={t('builder.undo')}>
            ↶
          </button>
          <button type="button" className={styles.iconBtn} onClick={redo} disabled={!canRedo} aria-label={t('builder.redo')} title={t('builder.redo')}>
            ↷
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={styles.secondaryBtn} onClick={handleExportHtml}>
            {t('builder.exportHtml')}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={handlePrintPdf}>
            {t('builder.printPdf')}
          </button>
          <button type="button" className={styles.primaryBtn} onClick={handleSave}>
            {t('builder.save')}
          </button>
          <LanguageToggle />
        </div>
      </div>

      <div className={styles.workspace}>
        <BlockPalette />
        <section className={styles.editor} aria-label={t('builder.editorAria')}>
          <BlockList />
        </section>
        <PreviewPanel />
      </div>
    </div>
  );
}

function SaveIndicator({ state, dirty }: { state: 'idle' | 'saving' | 'saved' | 'error'; dirty: boolean }) {
  const { t } = useLanguage();
  let label = '';
  let cls = styles.saveStatus;
  if (state === 'saving') label = t('builder.saving');
  else if (state === 'saved') {
    label = t('builder.saved');
    cls = `${styles.saveStatus} ${styles.saveStatusOk}`;
  } else if (state === 'error') {
    label = t('builder.saveFailed');
    cls = `${styles.saveStatus} ${styles.saveStatusErr}`;
  } else if (dirty) label = t('builder.dirty');
  if (!label) return null;
  return <span className={cls} role="status">{label}</span>;
}
