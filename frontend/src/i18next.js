// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@lang/en.json';
import ar from '@lang/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'ar',          // اللغة الافتراضية
    fallbackLng: 'ar',  // لو الترجمة مش موجودة
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
