import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Locale, getTranslations, Translations } from '@/lib/i18n';

const LOCALE_COOKIE = 'rdc-assay-locale';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [t, setT] = useState<Translations>(getTranslations('fr'));

  useEffect(() => {
    // Get locale from cookie or browser preference
    const savedLocale = Cookies.get(LOCALE_COOKIE) as Locale;
    const browserLocale = navigator.language.startsWith('en') ? 'en' : 'fr';
    const initialLocale = savedLocale || browserLocale;
    
    setLocale(initialLocale);
    setT(getTranslations(initialLocale));
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setT(getTranslations(newLocale));
    Cookies.set(LOCALE_COOKIE, newLocale, { expires: 365 });
  };

  return {
    locale,
    t,
    changeLocale,
  };
}
