import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import type { DocumentState } from '../types';
import styles from './DocumentListPage.module.css';

function formatTimestamp(ts: number, locale: string): string {
  return new Date(ts).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DocumentListPage() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [docs, setDocs] = useState<DocumentState[]>([]);

  useEffect(() => {
    setDocs(api.listDocuments());
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm(t('docs.deleteConfirm'))) return;
    api.deleteDocument(id);
    setDocs(api.listDocuments());
  };

  const locale = lang === 'ru' ? 'ru-RU' : 'en-US';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('docs.title')}</h1>
          <p className={styles.subtitle}>{t('docs.subtitle')}</p>
        </div>
        <button type="button" className={styles.primaryAction} onClick={() => navigate('/')}>
          {t('docs.newDocument')}
        </button>
      </header>

      {docs.length === 0 ? (
        <div className={styles.empty}>
          <h2>{t('docs.emptyTitle')}</h2>
          <p>{t('docs.emptyDesc')}</p>
          <Link to="/" className={styles.linkButton}>{t('docs.browse')}</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {docs.map((doc) => (
            <li key={doc.id ?? ''} className={styles.row}>
              <div className={styles.rowMain}>
                <Link to={`/builder/${doc.id}`} className={styles.docTitle}>{doc.title}</Link>
                <p className={styles.meta}>
                  {t('docs.meta', { n: doc.blocks.length, time: formatTimestamp(doc.updatedAt, locale) })}
                </p>
              </div>
              <div className={styles.rowActions}>
                <Link to={`/builder/${doc.id}`} className={styles.editLink}>{t('docs.edit')}</Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => doc.id && handleDelete(doc.id)}
                >
                  {t('docs.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
