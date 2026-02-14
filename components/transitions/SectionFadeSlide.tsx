"use client";
import React from "react";
import { motion } from "framer-motion";

const iosEase = [0.25, 0.8, 0.25, 1] as const;

export default function SectionFadeSlide({ children }: { children: React.ReactNode }) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.42, ease: iosEase }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
