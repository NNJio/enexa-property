"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

export function Marquee({ items }: { items: string[] }) {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const skew = useTransform(velocity, [-2500, 0, 2500], [-7, 0, 7], { clamp: true });
  const boost = useTransform(velocity, [-2500, 0, 2500], [-5, 1, 5], { clamp: true });
  const offset = useMotionValue(0);
  const direction = useRef(1);
  const x = useTransform(offset, (value) => `${value}%`);

  const calm = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (calm) return;
    const speed = boost.get();
    if (speed < 0) direction.current = -1;
    else if (speed > 1) direction.current = 1;
    const step = direction.current * Math.max(1, Math.abs(speed)) * 0.0022 * delta;
    let next = offset.get() - step;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    offset.set(next);
  });

  const row = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x, skewX: skew }}>
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}
            <svg viewBox="0 0 20 20" className="marquee-mark">
              <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" />
            </svg>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
