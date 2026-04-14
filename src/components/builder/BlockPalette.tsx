import { useMemo } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './BlockPalette.module.css';

export function BlockPalette() {
  const { state, addBlock } = useDocument();
  const { t } = useLanguage();
  const { template, doc } = state;

  const usedDefIds = useMemo(() => new Set(doc.blocks.map((b) => b.definitionId)), [doc.blocks]);
  const available = useMemo(
    () => template.blocks.filter((b) => !usedDefIds.has(b.id)),
    [template.blocks, usedDefIds],
  );

  return (
    <aside className={styles.palette} aria-label={t('palette.aria')}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t('palette.title')}</h2>
        <p className={styles.hint}>{t('palette.hint')}</p>
      </header>
      {available.length === 0 ? (
        <p className={styles.empty}>{t('palette.allAdded')}</p>
      ) : (
        <ul className={styles.list}>
          {available.map((block) => (
            <li key={block.id}>
              <button
                type="button"
                className={styles.item}
                onClick={() => addBlock(block.id)}
                aria-label={t('palette.addAria', { title: block.title })}
              >
                <span className={styles.itemTitle}>{block.title}</span>
                <span className={styles.itemDesc}>{block.description}</span>
                {block.condition ? (
                  <span className={styles.condTag} title={t('palette.conditionalTitle')}>
                    {t('palette.conditional', { variable: block.condition.variable })}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
