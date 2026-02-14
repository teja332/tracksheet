"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCardProps = {
  children?: React.ReactNode;
  className?: string;
  glassy?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  role?: string;
  "aria-label"?: string;
  loading?: boolean;
  onClick?: () => void;
};

const iosEase = [0.25, 0.8, 0.25, 1] as const;

export default function AnimatedCard({
  children,
  className = "",
  glassy = false,
  header,
  footer,
  role = "region",
  loading = false,
  onClick,
  ...rest
}: AnimatedCardProps) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isInteractive = typeof onClick === "function";

  return (
    <motion.article
      role={isInteractive ? "button" : role}
      aria-label={rest["aria-label"]}
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-xl border py-4 px-4 shadow-sm",
        glassy && "glass-sm",
        isInteractive && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={isInteractive ? { scale: 0.996 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.32, ease: iosEase }}
      style={{ willChange: "transform, opacity" }}
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {(header || loading) && (
        <div className="flex items-center justify-between mb-3" aria-hidden={loading}>
          {loading ? <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" /> : header}
        </div>
      )}

      <div className="flex-1" aria-busy={loading}>
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-3/5 bg-slate-200 rounded animate-pulse" />
          </div>
        ) : (
          children
        )}
      </div>

      {footer && <div className="mt-auto pt-3 flex gap-2 items-center justify-end border-t border-slate-100">{footer}</div>}
    </motion.article>
  );
}
