import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { translate, type Language } from '../i18n/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'patchwork.lang';

function detectInitial(): Language {
  if (typeof window === 'undefined') return 'ru';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'ru' || saved === 'en') return saved;
  const nav = window.navigator.language?.toLowerCase() ?? '';
  return nav.startsWith('ru') ? 'ru' : 'ru';
}

type ViewTransitionLike = { finished: Promise<unknown> };
type StartViewTransitionFn = (cb: () => void) => ViewTransitionLike;

function getStartViewTransition(): StartViewTransitionFn | null {
  const fn = (document as unknown as { startViewTransition?: unknown }).startViewTransition;
  return typeof fn === 'function' ? (fn as StartViewTransitionFn).bind(document) : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => detectInitial());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore quota / privacy mode failures
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    if (next === lang) return;
    const start = getStartViewTransition();
    if (start) {
      document.documentElement.classList.add('lang-transitioning');
      const vt = start(() => {
        flushSync(() => setLangState(next));
      });
      vt.finished.finally(() => {
        document.documentElement.classList.remove('lang-transitioning');
      });
    } else {
      setLangState(next);
    }
  }, [lang]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(lang, key, params),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
