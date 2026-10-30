import type { Metadata, Viewport } from "next";
import { K2D } from "next/font/google";
import { cookies, headers } from "next/headers";
import { PrefsProvider } from "@/components/prefs";
import type { Lang } from "@/i18n";
import "./globals.css";

const k2d = K2D({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const themeBoot = `(function(){try{var s=localStorage.getItem("enexa-theme");var t=s==="dark"||s==="light"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Enexa",
    template: "%s — Enexa",
  },
  description: "ประกาศที่ดินที่ Enexa รับมาขายเอง",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function resolveLang(accept: string | null, saved: string | undefined): Lang {
  if (saved === "en" || saved === "th") return saved;
  const first = accept?.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("en") ? "en" : "th";
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [jar, headerStore] = await Promise.all([cookies(), headers()]);
  const lang = resolveLang(
    headerStore.get("accept-language"),
    jar.get("enexa-lang")?.value,
  );

  return (
    <html lang={lang} className={k2d.className} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <PrefsProvider initialLang={lang}>{children}</PrefsProvider>
      </body>
    </html>
  );
}
