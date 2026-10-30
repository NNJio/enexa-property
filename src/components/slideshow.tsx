"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { introDelay } from "@/components/motion-kit";
import type { Lang } from "@/i18n";

type Photo = {
  src: string;
  alt: Record<Lang, string>;
  caption: Record<Lang, string>;
  focus?: string;
};

const wipe = [0.76, 0, 0.24, 1] as const;

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
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const [first] = useState(() => introDelay());
  const photo = photos[index] ?? photos[0];

  function go(next: number, dir = next > index ? 1 : -1) {
    setSlide([(next + photos.length) % photos.length, dir]);
  }

  if (!photo) return null;

  return (
    <div
      className="slides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={photo.src}
          className="slide"
          custom={direction}
          variants={{
            enter: (dir: number) => ({
              clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
            }),
            center: { clipPath: "inset(0% 0% 0% 0%)" },
            exit: (dir: number) => ({
              x: dir > 0 ? "-18%" : "18%",
              filter: "brightness(0.45)",
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.05, ease: wipe }}
        >
          <motion.div
            className="slide-media"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ duration: index === 0 && first > 0.5 ? 2.4 : 7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={photo.src}
              alt={photo.alt[lang]}
              fill
              priority={index === 0}
              sizes="(max-width: 800px) 100vw, 48vw"
              style={photo.focus ? { objectPosition: photo.focus } : undefined}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="slides-drag"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1, 1);
          else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1, -1);
        }}
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={`${photo.src}-${lang}`}
          className="slide-caption"
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="slide-count">
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
          {photo.caption[lang]}
        </motion.p>
      </AnimatePresence>

      <motion.div
        className="slide-nav"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: first + 0.6 }}
      >
        <motion.button
          type="button"
          className="step"
          onClick={() => go(index - 1, -1)}
          aria-label={prevLabel}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.85 }}
        >
          ‹
        </motion.button>
        <div className="dots">
          {photos.map((item, itemIndex) => (
            <button
              key={item.src}
              type="button"
              aria-label={item.caption[lang]}
              aria-current={itemIndex === index ? "true" : undefined}
              onClick={() => go(itemIndex)}
            >
              {itemIndex === index ? (
                <span
                  key={index}
                  className="dot-fill"
                  data-paused={paused ? "true" : "false"}
                  onAnimationEnd={() => go(index + 1, 1)}
                />
              ) : null}
            </button>
          ))}
        </div>
        <motion.button
          type="button"
          className="step"
          onClick={() => go(index + 1, 1)}
          aria-label={nextLabel}
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.85 }}
        >
          ›
        </motion.button>
      </motion.div>
    </div>
  );
}
