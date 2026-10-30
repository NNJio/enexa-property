"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/i18n";

export type Theme = "light" | "dark";

type Prefs = {
  lang: Lang;
  theme: Theme;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
};

const PrefsContext = createContext<Prefs | null>(null);

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function PrefsProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [theme, setThemeState] = useState<Theme>("light");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "dark" || current === "light") setThemeState(current);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("enexa-theme", theme);
    writeCookie("enexa-theme", theme);
  }, [theme, themeReady]);

  function setLang(next: Lang) {
    setLangState(next);
    document.documentElement.lang = next;
    localStorage.setItem("enexa-lang", next);
    writeCookie("enexa-lang", next);
  }

  return (
    <PrefsContext.Provider
      value={{ lang, theme, setLang, setTheme: setThemeState }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const prefs = useContext(PrefsContext);
  if (!prefs) throw new Error("usePrefs must be used within PrefsProvider");
  return prefs;
}
