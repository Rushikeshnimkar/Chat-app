import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  currentLanguage
}) => {
  const languages = [
    { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'ja', name: 'Japanese' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese (Simplified)' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'nl', name: 'Dutch' },
      { code: 'pl', name: 'Polish' },
      { code: 'th', name: 'Thai' },
      { code: 'tr', name: 'Turkish' },
      { code: 'vi', name: 'Vietnamese' }
  ];

  return (
    <div className="relative inline-block">
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="appearance-none pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <Globe className="absolute left-2 top-2.5 text-gray-400" size={20} />
    </div>
  );
}; 

