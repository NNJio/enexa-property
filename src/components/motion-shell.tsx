"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePrefs } from "@/components/prefs";

export function MotionShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    return () => lenis.destroy();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Intro />
      {children}
      <Cursor />
    </MotionConfig>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

const introWord = "Enexa";

const noSubscribe = () => () => {};

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function Intro() {
  const { lang } = usePrefs();
  const [done, setDone] = useState(false);
  const mode = useSyncExternalStore(
    noSubscribe,
    () => document.documentElement.dataset.intro,
    () => "play",
  );
  const playing = mode === "play" && !done;

  function finish() {
    try {
      sessionStorage.setItem("enexa-intro", "1");
    } catch {}
    document.documentElement.dataset.intro = "done";
    setDone(true);
  }

  return (
    <AnimatePresence>
      {playing ? (
        <motion.div
          key="intro"
          className="intro"
          aria-hidden="true"
          initial={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0% round 0px 0px 48px 48px)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <div className="intro-word">
            {introWord.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 + index * 0.06 }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="intro-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            onAnimationComplete={finish}
          />
          <motion.p
            className="intro-note"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {lang === "th" ? "ที่นา · ท่าตาล · พิษณุโลก" : "Rice field · Tha Tan · Phitsanulok"}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Cursor() {
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const calm = useMedia("(prefers-reduced-motion: reduce)");
  const enabled = fine && !calm;
  const [mode, setMode] = useState<"idle" | "link" | "drag">("idle");
  const { lang } = usePrefs();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 520, damping: 40, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 520, damping: 40, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    function move(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      if (target?.closest(".slides-drag")) setMode("drag");
      else if (target?.closest("a, button")) setMode("link");
      else setMode("idle");
    }

    function leave() {
      x.set(-100);
      y.set(-100);
    }

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="cursor"
      data-mode={mode}
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    >
      <motion.span
        className="cursor-ring"
        animate={{ scale: mode === "idle" ? 1 : mode === "link" ? 1.9 : 2.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
      <AnimatePresence>
        {mode === "drag" ? (
          <motion.span
            className="cursor-label"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            {lang === "th" ? "ลาก" : "Drag"}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
