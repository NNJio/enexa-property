"use client";

import Image from "next/image";
import Link from "next/link";
import { useDocumentTitle } from "@/components/use-document-title";
import { Controls } from "@/components/controls";
import { usePrefs } from "@/components/prefs";
import { formatBaht, type Listing } from "@/data/listings";
import { site } from "@/data/site";
import { ui } from "@/i18n";

export function ListingIndex({ listings }: { listings: Listing[] }) {
  const { lang } = usePrefs();
  const t = ui[lang];

  useDocumentTitle(`${t.listings} — Enexa`);

  return (
    <main className="index">
      <header className="index-head">
        <div className="index-tools">
          <Link href="/">{site.name}</Link>
          <Controls />
        </div>
        <h1>{t.listings}</h1>
        <p>{t.listingsLead}</p>
      </header>
      <ul>
        {listings.map((listing, position) => (
          <li key={listing.slug}>
            <Link href={`/listings/${listing.slug}`}>
              <span className="thumb">
                <Image src={listing.photos[0].src} alt="" fill sizes="120px" />
              </span>
              <span className="index-copy">
                <strong>{listing.text[lang].title}</strong>
                <span>
                  {String(position + 1).padStart(2, "0")}
                  {" · "}
                  {listing.text[lang].place}
                </span>
              </span>
              <b>
                {formatBaht(listing.pricePerRai)}
                <span> {t.perRai}</span>
              </b>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
