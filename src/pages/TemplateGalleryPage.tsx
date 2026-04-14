import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import styles from './TemplateGalleryPage.module.css';

const ALL_FILTER = '__all__';

export function TemplateGalleryPage() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const templates = useMemo(() => api.listTemplates(lang), [lang]);
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((tp) => set.add(tp.category));
    return [ALL_FILTER, ...Array.from(set)];
  }, [templates]);

  const [filter, setFilter] = useState<string>(ALL_FILTER);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((tp) => {
      if (filter !== ALL_FILTER && tp.category !== filter) return false;
      if (!q) return true;
      return tp.name.toLowerCase().includes(q) || tp.description.toLowerCase().includes(q);
    });
  }, [templates, filter, query]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{t('gallery.eyebrow')}</p>
          <h1 className={styles.heroTitle}>{t('gallery.heroTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('gallery.heroSubtitle')}</p>
        </div>
      </section>

      <section className={styles.toolbar} aria-label={t('gallery.filterAria')}>
        <div role="tablist" aria-label={t('gallery.categoriesAria')} className={styles.tabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              className={filter === cat ? styles.tabActive : styles.tab}
              onClick={() => setFilter(cat)}
            >
              {cat === ALL_FILTER ? t('gallery.allFilter') : cat}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span className="sr-only">{t('gallery.searchLabel')}</span>
          <input
            type="search"
            placeholder={t('gallery.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </section>

      {visible.length === 0 ? (
        <p className={styles.empty}>{t('gallery.empty')}</p>
      ) : (
        <ul className={styles.grid}>
          {visible.map((tp) => (
            <li key={tp.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.badge}>{tp.category}</span>
                <span className={styles.timeHint}>{t('gallery.minutes', { n: tp.estimatedMinutes })}</span>
              </div>
              <h2 className={styles.cardTitle}>{tp.name}</h2>
              <p className={styles.cardDesc}>{tp.description}</p>
              <div className={styles.cardFoot}>
                <button
                  type="button"
                  className={styles.useButton}
                  onClick={() => navigate(`/builder/new/${tp.id}`)}
                >
                  {t('gallery.useTemplate')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
