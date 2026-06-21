"use client";

import { useState, useRef, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES, LanguageCode } from '@/constants/languages';

export function LanguageSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('es');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Load active language on mount
  useEffect(() => {
    const saved = getCookie('NEXT_LOCALE') as LanguageCode;
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setCurrentLang(saved);
    }
  }, []);

  // 2. Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setCookie('NEXT_LOCALE', code, { maxAge: 60 * 60 * 24 * 365 }); // 1 year expiry
    setCurrentLang(code);
    setIsOpen(false);
    router.refresh();
  };

  const activeLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* COMPACT TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 select-none
          ${isOpen 
            ? 'bg-slate-50 border-slate-200 text-slate-900' 
            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }
        `}
      >
        <span className="text-sm leading-none filter saturate-[0.85]">{activeLang.flag}</span>
        <span className="uppercase tracking-wider text-[11px] font-bold">{activeLang.code}</span>
        <ChevronDown 
          size={10} 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* MINIMALIST DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
          >
            <div className="py-0.5 max-h-48 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`
                    w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors text-left
                    ${currentLang === lang.code 
                      ? 'bg-primary/5 text-primary font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  
                  {currentLang === lang.code && (
                    <Check size={12} className="text-primary stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}