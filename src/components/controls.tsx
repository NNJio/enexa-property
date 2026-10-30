"use client";

import { ui, type Lang } from "@/i18n";
import { usePrefs, type Theme } from "@/components/prefs";

export function Controls() {
  const { lang, theme, setLang, setTheme } = usePrefs();
  const t = ui[lang];

  return (
    <div className="tools">
      <div className="tool-set" role="group" aria-label={lang === "th" ? "ภาษา" : "Language"}>
        <Tool pressed={lang === "th"} onClick={() => setLang("th" satisfies Lang)}>
          TH
        </Tool>
        <Tool pressed={lang === "en"} onClick={() => setLang("en")}>
          EN
        </Tool>
      </div>
      <div className="tool-set" role="group" aria-label={lang === "th" ? "โหมดสี" : "Color mode"}>
        <Tool pressed={theme === "light"} onClick={() => setTheme("light" satisfies Theme)}>
          {t.light}
        </Tool>
        <Tool pressed={theme === "dark"} onClick={() => setTheme("dark")}>
          {t.dark}
        </Tool>
      </div>
    </div>
  );
}

function Tool({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick}>
      {children}
    </button>
  );
}
