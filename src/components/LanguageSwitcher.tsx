import React from 'react';
import { Language } from '../utils/i18n';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  return (
    <div className="language-toggle-group">
      <Languages size={14} className="text-secondary" />
      <button
        type="button"
        className={`lang-btn ${currentLang === 'en' ? 'lang-btn-active' : ''}`}
        onClick={() => onLanguageChange('en')}
        title="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-btn ${currentLang === 'tl' ? 'lang-btn-active' : ''}`}
        onClick={() => onLanguageChange('tl')}
        title="Switch to Tagalog (Filipino)"
      >
        TL (PH)
      </button>
    </div>
  );
};
