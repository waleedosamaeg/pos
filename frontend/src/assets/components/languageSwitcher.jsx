// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '@css/changeLang.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr'; // تعديل اتجاه النص
  };

  return (
    <div className="language-switcher">
      <button
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={i18n.language === 'ar' ? 'active' : ''}
        onClick={() => changeLanguage('ar')}
      >
        ع
      </button>
    </div>
  );
}
