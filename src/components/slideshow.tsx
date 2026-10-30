"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Lang } from "@/i18n";

type Photo = {
  src: string;
  alt: Record<Lang, string>;
  caption: Record<Lang, string>;
  fit?: "contain";
};

export function Slideshow({
  photos,
  lang,
  prevLabel,
  nextLabel,
}: {
  photos: Photo[];
  lang: Lang;
  prevLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const photo = photos[index] ?? photos[0];

  useEffect(() => {
    if (paused || photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [paused, photos.length, index]);

  function go(next: number) {
    setIndex((next + photos.length) % photos.length);
  }

  if (!photo) return null;

  return (
    <div
      className="slides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Image
        key={photo.src}
        src={photo.src}
        alt={photo.alt[lang]}
        fill
        priority={index === 0}
        sizes="(max-width: 800px) 100vw, 48vw"
        className={photo.fit === "contain" ? "fit-contain" : undefined}
      />
      <p className="slide-caption">{photo.caption[lang]}</p>
      <div className="slide-nav">
        <button type="button" className="step" onClick={() => go(index - 1)} aria-label={prevLabel}>
          ‹
        </button>
        <div className="dots">
          {photos.map((item, itemIndex) => (
            <button
              key={item.src}
              type="button"
              aria-label={item.caption[lang]}
              aria-current={itemIndex === index ? "true" : undefined}
              onClick={() => go(itemIndex)}
            />
          ))}
        </div>
        <button type="button" className="step" onClick={() => go(index + 1)} aria-label={nextLabel}>
          ›
        </button>
      </div>
    </div>
  );
}
