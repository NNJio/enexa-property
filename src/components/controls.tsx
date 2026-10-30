"use client";

import { motion } from "motion/react";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { ui, type Lang } from "@/i18n";
import { usePrefs, type Theme } from "@/components/prefs";

function canTransition() {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Controls() {
  const { lang, theme, setLang, setTheme } = usePrefs();
  const t = ui[lang];

  function switchLang(next: Lang) {
    if (next === lang) return;
    if (!canTransition()) return setLang(next);
    document.startViewTransition(() => flushSync(() => setLang(next)));
  }

  function switchTheme(event: MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      flushSync(() => setTheme(next));
      root.dataset.theme = next;
    };
    if (!canTransition()) return apply();

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add("vt-theme");
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 850,
          easing: "cubic-bezier(0.76, 0, 0.24, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
    transition.finished.finally(() => root.classList.remove("vt-theme"));
  }

  return (
    <div className="tools">
      <div className="lang" role="group" aria-label={lang === "th" ? "ภาษา" : "Language"}>
        {(["th", "en"] as const).map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={lang === code}
            onClick={() => switchLang(code)}
          >
            {lang === code ? (
              <motion.span layoutId="lang-pill" className="lang-pill" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
            ) : null}
            <span className="lang-code">{code.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="theme-switch"
        aria-pressed={theme === "dark"}
        onClick={switchTheme}
      >
        <span className="theme-track" data-on={theme === "dark" ? "true" : "false"}>
          <span className="theme-knob">
            <span className="theme-crater" />
          </span>
        </span>
        {theme === "dark" ? t.dark : t.light}
      </button>
    </div>
  );
}
