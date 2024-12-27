import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  currentLanguage
}) => {
  const { isDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'ja', name: 'Japanese' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
          isDarkMode
            ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <Globe size={18} />
        <span className="text-sm font-medium">
          {selectedLanguage?.name || 'Select Language'}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 mt-2 py-2 w-48 rounded-xl shadow-lg z-20 border ${
            isDarkMode
              ? 'bg-zinc-800 border-zinc-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`max-h-60 overflow-y-auto scrollbar-thin ${
              isDarkMode
                ? 'scrollbar-track-zinc-800 scrollbar-thumb-zinc-700'
                : 'scrollbar-track-gray-100 scrollbar-thumb-gray-300'
            }`}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentLanguage === lang.code
                      ? isDarkMode
                        ? 'bg-violet-600/20 text-violet-300'
                        : 'bg-blue-50 text-blue-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-zinc-700'
                        : 'text-gray-700 hover:bg-gray-50'
                  } flex items-center justify-between`}
                >
                  {lang.name}
                  {currentLanguage === lang.code && (
                    <div className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-violet-400' : 'bg-blue-500'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 

