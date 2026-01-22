import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import sw from './locales/sw.json';
import kam from './locales/kam.json';
import kik from './locales/kik.json';
import ig from './locales/ig.json';
import mas from './locales/mas.json';
import zu from './locales/zu.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sw: { translation: sw },
    kam: { translation: kam },
    kik: { translation: kik },
    ig: { translation: ig },
    mas: { translation: mas },
    zu: { translation: zu }
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;