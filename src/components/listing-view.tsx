"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useDocumentTitle } from "@/components/use-document-title";
import { Controls } from "@/components/controls";
import { Marquee } from "@/components/marquee";
import { CountUp, Magnetic, Reveal, SplitText, ease, introDelay } from "@/components/motion-kit";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mapProgress } = useScroll({
    target: mapRef,
    offset: ["start end", "center center"],
  });
  const mapClip = useTransform(
    mapProgress,
    [0, 1],
    ["inset(14% 10% 14% 10% round 56px)", "inset(0% 0% 0% 0% round 24px)"],
  );

  useDocumentTitle(`${copy.title} — Enexa`);

  const specs = [
    { label: t.document, value: copy.deed },
    { label: t.area, value: formatArea(listing, lang) },
    {
      label: t.total,
      value: (
        <>
          <CountUp value={totalBaht(listing)} format={formatBaht} /> {t.baht}
        </>
      ),
    },
    { label: t.location, value: copy.location },
  ];

  return (
    <article className="sheet">
      <motion.figure
        className="plate"
        initial={{ clipPath: "inset(8% 8% 8% 8% round 48px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
        transition={{ duration: 1.5, ease, delay: introDelay(-0.75) }}
      >
        <Slideshow
          photos={listing.photos}
          lang={lang}
          prevLabel={t.prev}
          nextLabel={t.next}
        />
        <motion.div
          className="plate-chips"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: introDelay(0.5) }}
        >
          <Link className="brand" href="/">
            <span className="brand-dot" />
            {site.name}
          </Link>
          <a className="coord" href={mapsUrl(listing)}>
            {listing.lat.toFixed(5)}, {listing.lng.toFixed(5)}
          </a>
        </motion.div>
      </motion.figure>

      <div className="dossier">
        <Reveal immediate delay={0.35} y={-12} className="tools-wrap">
          <Controls />
        </Reveal>

        <div className="block hero">
          <Reveal immediate delay={0} y={16}>
            <p className="kicker">
              <span className="kicker-line" />
              {copy.kicker}
            </p>
          </Reveal>
          <h1 key={lang}>
            <SplitText lines={copy.titleLines} delay={0.05} />
          </h1>
          <Reveal immediate delay={0.45} y={18}>
            <ul className="chips">
              <li>{copy.role}</li>
              <li>{copy.deed}</li>
              <li>{copy.sale}</li>
            </ul>
          </Reveal>
          <Reveal immediate delay={0.6}>
            <p className="price">
              <span className="price-num">
                <CountUp value={listing.pricePerRai} format={formatBaht} immediate delay={0.6} />
              </span>
              <span className="price-unit">{t.perRai}</span>
            </p>
          </Reveal>
        </div>

        <div className="block">
          <dl className="specs">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.9, ease, delay: index * 0.08 }}
              >
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </motion.div>
            ))}
          </dl>
          <Reveal>
            <p className="fine">{t.areaNote}</p>
          </Reveal>
        </div>

        <Marquee
          items={[
            copy.deed,
            formatArea(listing, lang),
            copy.sale,
            `${formatBaht(listing.pricePerRai)} ${t.perRai}`,
            copy.kicker,
          ]}
        />

        <div className="block">
          {copy.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.08}>
              <p className={index === 0 ? "prose lead" : "prose"}>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <div className="block approach">
          <h2 key={`directions-${lang}`}>
            <SplitText lines={[t.directions]} inView stagger={0.05} />
          </h2>
          <dl className="specs">
            {[...copy.notes, { label: t.coordinates, value: `${listing.lat}, ${listing.lng}` }].map(
              (note, index) => (
                <motion.div
                  key={note.label}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.9, ease, delay: index * 0.08 }}
                >
                  <dt>{note.label}</dt>
                  <dd>{note.value}</dd>
                </motion.div>
              ),
            )}
          </dl>
          <motion.div ref={mapRef} className="map" style={{ clipPath: mapClip }}>
            <iframe
              title={`${t.mapOf} ${copy.title}`}
              src={mapsEmbed(listing)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>

        <motion.section
          className="contact"
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.2, ease }}
        >
          <div className="contact-glow" aria-hidden="true" />
          <h2 key={`visit-${lang}`}>
            <SplitText lines={[t.visit]} inView stagger={0.05} delay={0.2} />
          </h2>
          <Reveal delay={0.35}>
            <p className="who">{site.ownerName}</p>
          </Reveal>
          <Reveal delay={0.45}>
            <p>{t.visitBody}</p>
          </Reveal>
          <div className="actions">
            {[
              { className: "solid", href: mapsUrl(listing), label: t.openMap, show: true },
              {
                className: "line",
                href: `https://line.me/ti/p/~${site.lineId}`,
                label: `${t.line} · ${site.lineId}`,
                show: Boolean(site.lineId),
              },
              {
                className: "solid",
                href: `tel:+66${phoneHref.slice(1)}`,
                label: `${t.call} ${site.phone}`,
                show: Boolean(site.phone),
              },
            ]
              .filter((action) => action.show)
              .map((action, index) => (
                <motion.div
                  key={action.href}
                  className="action"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease, delay: 0.55 + index * 0.1 }}
                >
                  <Magnetic className={action.className} href={action.href}>
                    <span>{action.label}</span>
                  </Magnetic>
                </motion.div>
              ))}
          </div>
        </motion.section>
      </div>
    </article>
  );
}
