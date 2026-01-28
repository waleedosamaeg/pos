import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const langStyle = {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '10px',
    padding: '10px 12px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  };

  const buttonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: isActive ? '700' : '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: isActive 
      ? 'linear-gradient(135deg, #facc15 0%, #eab308 100%)'
      : 'rgba(71, 85, 105, 0.3)',
    color: isActive ? '#1e293b' : '#cbd5e1',
    border: isActive ? '1px solid #facc15' : '1px solid transparent',
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isActive 
      ? '0 0 15px rgba(250, 204, 21, 0.3)'
      : 'none',
  });

  return (
    <div style={langStyle}>
      <Globe size={14} color="#cbd5e1" style={{ marginRight: '4px' }} />
      
      <button
        onClick={() => changeLanguage('en')}
        style={buttonStyle(i18n.language === 'en')}
        title="English"
      >
        EN
      </button>
      
      <div style={{
        width: '1px',
        height: '20px',
        backgroundColor: 'rgba(71, 85, 105, 0.5)',
        margin: '0 2px',
      }} />
      
      <button
        onClick={() => changeLanguage('ar')}
        style={buttonStyle(i18n.language === 'ar')}
        title="العربية"
      >
        العربية
      </button>
    </div>
  );
}

// Export compact version for menu bar
export function CompactLanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const buttonStyle = (isActive) => ({
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: isActive ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive 
      ? 'rgba(250, 204, 21, 0.2)'
      : 'transparent',
    color: isActive ? '#facc15' : '#cbd5e1',
    borderBottom: isActive ? '2px solid #facc15' : '2px solid transparent',
  });

  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      <button
        onClick={() => changeLanguage('en')}
        style={buttonStyle(i18n.language === 'en')}
        title="English"
      >
        EN
      </button>
      <div style={{
        width: '1px',
        height: '16px',
        backgroundColor: 'rgba(71, 85, 105, 0.3)',
      }} />
      <button
        onClick={() => changeLanguage('ar')}
        style={buttonStyle(i18n.language === 'ar')}
        title="العربية"
      >
        AR
      </button>
    </div>
  );
}
