"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Locale, SUPPORTED_LOCALES } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: typeof translations["en"];
  locales: typeof SUPPORTED_LOCALES;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
  locales: SUPPORTED_LOCALES,
});

const VALID_LOCALES: Locale[] = ["en", "ta", "te", "kn", "ml", "hi"];

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 1. Try reading from localStorage
    const saved = localStorage.getItem("agribridge_locale") as Locale;
    if (saved && VALID_LOCALES.includes(saved)) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      return;
    }

    // 2. Try reading from cookie
    const match = document.cookie.match(/agribridge_locale=([a-z]{2})/);
    if (match && VALID_LOCALES.includes(match[1] as Locale)) {
      setLocaleState(match[1] as Locale);
      document.documentElement.lang = match[1];
    }
  }, []);

  const setLocale = (loc: Locale) => {
    if (!VALID_LOCALES.includes(loc)) return;
    setLocaleState(loc);
    try {
      localStorage.setItem("agribridge_locale", loc);
      document.cookie = `agribridge_locale=${loc}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = loc;
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const t = translations[locale] || translations.en;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales: SUPPORTED_LOCALES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
