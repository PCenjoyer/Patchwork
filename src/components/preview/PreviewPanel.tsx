import { useMemo } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { renderDocument } from '../../utils/export';
import styles from './PreviewPanel.module.css';

export function PreviewPanel() {
  const { state } = useDocument();
  const { t, lang } = useLanguage();
  const { template, doc } = state;

  const debouncedValues = useDebouncedValue(doc.values, 150);
  const debouncedTitle = useDebouncedValue(doc.title, 150);

  // NOTE: don't depend on `doc` itself — its reference changes on every keystroke, which would
  // defeat the debouncing below. Depend on the debounced slices plus block order only.
  const rendered = useMemo(
    () => renderDocument(template, { ...doc, values: debouncedValues, title: debouncedTitle }, lang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template, doc.blocks, debouncedValues, debouncedTitle, lang],
  );

  return (
    <div className={styles.panel} aria-label={t('preview.aria')}>
      <header className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{t('preview.title')}</h2>
        <span className={styles.panelHint}>{t('preview.hint')}</span>
      </header>
      <div className={styles.scroll}>
        <article className={styles.page}>
          <h1 className={styles.docTitle}>{debouncedTitle || t('builder.untitled')}</h1>
          {rendered.length === 0 ? (
            <p className={styles.empty}>{t('preview.empty')}</p>
          ) : (
            rendered.map((block) => (
              <section key={block.instanceId} className={styles.block}>
                {block.text.split(/\n{2,}/).map((para, idx) => (
                  <p key={idx} className={styles.para}>
                    {renderInlineLines(para)}
                  </p>
                ))}
              </section>
            ))
          )}
        </article>
      </div>
    </div>
  );
}

function renderInlineLines(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => (
    <span key={idx}>
      {line}
      {idx < lines.length - 1 ? <br /> : null}
    </span>
  ));
}
