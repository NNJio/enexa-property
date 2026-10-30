"use client";

import Link from "next/link";
import { useDocumentTitle } from "@/components/use-document-title";
import { Controls } from "@/components/controls";
import { usePrefs } from "@/components/prefs";
import { site } from "@/data/site";
import { ui } from "@/i18n";

export default function NotFound() {
  const { lang } = usePrefs();
  const t = ui[lang];

  useDocumentTitle(`${t.missing} — Enexa`);

  return (
    <main className="index">
      <header className="index-head">
        <div className="index-tools">
          <Link href="/">{site.name}</Link>
          <Controls />
        </div>
        <h1>{t.missing}</h1>
        <p>
          <Link href="/">{t.back}</Link>
        </p>
      </header>
    </main>
  );
}
