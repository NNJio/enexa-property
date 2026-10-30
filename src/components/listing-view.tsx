"use client";

import Link from "next/link";
import { useDocumentTitle } from "@/components/use-document-title";
import { Controls } from "@/components/controls";
import { Slideshow } from "@/components/slideshow";
import { usePrefs } from "@/components/prefs";
import {
  formatArea,
  formatBaht,
  mapsEmbed,
  mapsUrl,
  totalBaht,
  type Listing,
} from "@/data/listings";
import { site } from "@/data/site";
import { ui } from "@/i18n";

export function ListingView({ listing }: { listing: Listing }) {
  const { lang } = usePrefs();
  const t = ui[lang];
  const copy = listing.text[lang];
  const phoneHref = site.phone.replace(/[^\d+]/g, "");

  useDocumentTitle(`${copy.title} — Enexa`);

  return (
    <article className="sheet">
      <figure className="plate">
        <Slideshow
          photos={listing.photos}
          lang={lang}
          prevLabel={t.prev}
          nextLabel={t.next}
        />
        <Link className="brand" href="/">
          {site.name}
        </Link>
        <a className="coord" href={mapsUrl(listing)}>
          {listing.lat.toFixed(5)}, {listing.lng.toFixed(5)}
        </a>
      </figure>

      <div className="dossier">
        <div className="block">
          <Controls />
          <p className="kicker">{copy.kicker}</p>
          <h1>
            {copy.titleLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="meta">
            {copy.role}
            <span aria-hidden="true"> · </span>
            {copy.deed}
            <span aria-hidden="true"> · </span>
            {copy.sale}
          </p>
          <p className="price">
            <span>{formatBaht(listing.pricePerRai)}</span>
            <span>{t.perRai}</span>
          </p>

          <dl className="specs">
            <div>
              <dt>{t.document}</dt>
              <dd>{copy.deed}</dd>
            </div>
            <div>
              <dt>{t.area}</dt>
              <dd>{formatArea(listing, lang)}</dd>
            </div>
            <div>
              <dt>{t.total}</dt>
              <dd>
                {formatBaht(totalBaht(listing))} {t.baht}
              </dd>
            </div>
            <div>
              <dt>{t.location}</dt>
              <dd>{copy.location}</dd>
            </div>
          </dl>
          <p className="fine">{t.areaNote}</p>

          {copy.body.map((paragraph) => (
            <p key={paragraph} className="prose">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="block approach">
          <h2>{t.directions}</h2>
          <dl className="specs">
            {copy.notes.map((note) => (
              <div key={note.label}>
                <dt>{note.label}</dt>
                <dd>{note.value}</dd>
              </div>
            ))}
            <div>
              <dt>{t.coordinates}</dt>
              <dd>
                {listing.lat}, {listing.lng}
              </dd>
            </div>
          </dl>
          <div className="map">
            <iframe
              title={`${t.mapOf} ${copy.title}`}
              src={mapsEmbed(listing)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <section className="contact">
          <h2>{t.visit}</h2>
          <p className="who">{site.ownerName}</p>
          <p>{t.visitBody}</p>
          <div className="actions">
            <a className="solid" href={mapsUrl(listing)}>
              {t.openMap}
            </a>
            {site.lineId ? (
              <a className="line" href={`https://line.me/ti/p/~${site.lineId}`}>
                {t.line} · {site.lineId}
              </a>
            ) : null}
            {site.phone ? (
              <a className="solid" href={`tel:+66${phoneHref.slice(1)}`}>
                {t.call} {site.phone}
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </article>
  );
}
