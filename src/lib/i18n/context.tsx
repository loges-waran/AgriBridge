"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Locale } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: typeof translations["en"];
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("agribridge_locale") as Locale;
    if (saved && (saved === "en" || saved === "ta")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem("agribridge_locale", loc);
  };

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
