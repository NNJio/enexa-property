"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

export const ease = [0.16, 1, 0.3, 1] as const;

export function introDelay(extra = 0) {
  if (typeof document === "undefined") return Math.max(0, extra);
  return Math.max(0, (document.documentElement.dataset.intro === "play" ? 1.55 : 0.1) + extra);
}

// Thai vowels and tone marks are combining characters; they must stay with their base letter.
function clusters(text: string) {
  return text.match(/\P{M}\p{M}*/gu) ?? [];
}

export function SplitText({
  lines,
  delay = 0,
  stagger = 0.035,
  inView = false,
}: {
  lines: string[];
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const run = inView ? seen : true;
  const base = inView ? delay : introDelay(delay);
  let index = 0;

  return (
    <span ref={ref} className="split" aria-label={lines.join(" ")}>
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="split-line" aria-hidden="true">
          {clusters(line).map((char) => {
            const order = index++;
            return (
              <motion.span
                key={`${char}-${order}`}
                className="split-char"
                initial={{ y: "115%", rotate: 6, opacity: 0 }}
                animate={run ? { y: "0%", rotate: 0, opacity: 1 } : undefined}
                transition={{ duration: 1, ease, delay: base + order * stagger }}
              >
                {char === " " ? "\u00a0" : char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 36,
  immediate = false,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  immediate?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const hidden = { opacity: 0, y, filter: "blur(10px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

  if (immediate) {
    return (
      <motion.div
        initial={hidden}
        animate={shown}
        transition={{ duration: 1.1, ease, delay: introDelay(delay) }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  format,
  delay = 0,
  immediate = false,
}: {
  value: number;
  format: (value: number) => string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(value);
  const text = useTransform(count, (latest) => format(Math.round(latest)));
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const run = immediate || seen;

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    count.set(0);
    const controls = animate(count, value, {
      duration: 2.2,
      ease,
      delay: immediate ? introDelay(delay) : delay,
    });
    return () => controls.stop();
  }, [run, value, delay, immediate, count]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

export function Magnetic({
  children,
  strength = 0.3,
  ...rest
}: { children: ReactNode; strength?: number } & Omit<HTMLMotionProps<"a">, "children">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.a
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * strength);
        y.set((event.clientY - rect.top - rect.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
