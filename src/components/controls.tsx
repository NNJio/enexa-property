"use client";

import { ui, type Lang } from "@/i18n";
import { usePrefs, type Theme } from "@/components/prefs";

export function Controls() {
  const { lang, theme, setLang, setTheme } = usePrefs();
  const t = ui[lang];

  return (
    <div className="tools">
      <div className="lang" role="group" aria-label={lang === "th" ? "ภาษา" : "Language"}>
        <button type="button" aria-pressed={lang === "th"} onClick={() => setLang("th" satisfies Lang)}>
          TH
        </button>
        <span aria-hidden="true">/</span>
        <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
          EN
        </button>
      </div>
      <button
        type="button"
        className="theme-switch"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme(theme === "dark" ? "light" : ("dark" satisfies Theme))}
      >
        <span className="theme-track" data-on={theme === "dark" ? "true" : "false"}>
          <span className="theme-knob" />
        </span>
        {theme === "dark" ? t.dark : t.light}
      </button>
    </div>
  );
}
