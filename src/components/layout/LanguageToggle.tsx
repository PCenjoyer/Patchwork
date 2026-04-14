import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGES } from '../../i18n/translations';
import styles from './LanguageToggle.module.css';

interface Props {
  className?: string;
}

export function LanguageToggle({ className }: Props) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className={`${styles.group} ${className ?? ''}`}
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={lang === l.code ? styles.btnActive : styles.btn}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
