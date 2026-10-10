"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Counter({ to, prefix = "", suffix = "", className = "", duration = 1.8 }: { to: number; prefix?: string; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString("ru-RU").replace(/ /g, " ")}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, to, duration, mv]);

  return <motion.span ref={ref} className={`num ${className}`}>{text}</motion.span>;
}
